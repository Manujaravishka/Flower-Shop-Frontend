import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import AdminLayout from "@/layouts/AdminLayout";
import { orderApi, customerApi } from "@/lib/api";
import { toast } from "sonner";

interface OrderItem {
  giftId?: string;
  giftName?: string;
  name?: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  status: string;
}

interface Customer {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusConfig: Record<
  string,
  { icon: typeof Clock; label: string; bg: string; text: string; border: string }
> = {
  pending: {
    icon: Clock,
    label: "Pending",
    bg: "rgba(200,162,74,0.12)",
    text: "#8A6B22",
    border: "rgba(200,162,74,0.3)",
  },
  processing: {
    icon: Package,
    label: "Processing",
    bg: "rgba(27,67,50,0.1)",
    text: "#1B4332",
    border: "rgba(27,67,50,0.25)",
  },
  shipped: {
    icon: Truck,
    label: "Shipped",
    bg: "rgba(244,194,194,0.35)",
    text: "#7A3849",
    border: "rgba(244,194,194,0.6)",
  },
  delivered: {
    icon: CheckCircle,
    label: "Delivered",
    bg: "rgba(27,67,50,0.18)",
    text: "#0E2B1E",
    border: "rgba(27,67,50,0.4)",
  },
  cancelled: {
    icon: XCircle,
    label: "Cancelled",
    bg: "rgba(212,121,121,0.12)",
    text: "#7A2A2A",
    border: "rgba(212,121,121,0.3)",
  },
};

const AdminOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const run = async () => {
      try {
        const data = await orderApi.get(id);
        if (cancelled) return;
        const found = (data as Order) ?? (data as { data?: Order })?.data ?? null;
        if (!found) {
          setError("Order not found");
          return;
        }
        setOrder(found);
        try {
          const cust = await customerApi.get(found.customerId);
          const c = (cust as Customer) ?? (cust as { data?: Customer })?.data ?? null;
          if (!cancelled) setCustomer(c);
        } catch {
          // best effort
        }
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load order";
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleStatusChange = async (status: string) => {
    if (!order) return;
    setSavingStatus(true);
    try {
      await orderApi.updateStatus({ orderId: order._id, status });
      setOrder({ ...order, status });
      toast.success("Status updated");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      toast.error(message);
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[40vh] flex items-center justify-center">
          <LuxurySpinner size={32} />
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <Button asChild variant="ghost" className="gap-2">
            <Link to="/admin/orders">
              <ArrowLeft className="w-4 h-4" />
              Back to orders
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">{error ?? "Order not found"}</p>
        </div>
      </AdminLayout>
    );
  }

  const cfg = statusConfig[order.status] ?? statusConfig.pending;
  const StatusIcon = cfg.icon;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Button asChild variant="ghost" className="gap-2 -ml-2">
          <Link to="/admin/orders">
            <ArrowLeft className="w-4 h-4" />
            Back to orders
          </Link>
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Order
            </p>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
              #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed on {new Date(order.orderDate).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="gap-1.5 px-3 py-1.5"
              style={{ background: cfg.bg, color: cfg.text, borderColor: cfg.border }}
            >
              <StatusIcon className="w-3.5 h-3.5" strokeWidth={2} />
              {cfg.label}
            </Badge>
            <Select
              value={order.status}
              onValueChange={handleStatusChange}
              disabled={savingStatus}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {statusConfig[s]?.label ?? s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="border-cream-200/80 shadow-soft">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-cream-200/70">
              {order.items.map((item, idx) => (
                <li key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">
                      {item.giftName ?? item.name ?? "Bouquet"}
                    </p>
                    <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <p className="font-medium">Rs. {Number(item.price ?? 0).toLocaleString()}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-cream-200/70 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-display text-xl font-medium">
                Rs. {Number(order.totalAmount ?? 0).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cream-200/80 shadow-soft">
          <CardHeader>
            <CardTitle>Customer</CardTitle>
            <CardDescription>Delivery details for this order.</CardDescription>
          </CardHeader>
          <CardContent>
            {customer ? (
              <div className="space-y-1">
                <p className="font-medium text-foreground">{customer.name}</p>
                {customer.email && <p className="text-sm text-muted-foreground">{customer.email}</p>}
                {customer.phone && <p className="text-sm text-muted-foreground">{customer.phone}</p>}
                {customer.address && (
                  <p className="text-sm text-muted-foreground whitespace-pre-line pt-2">
                    {customer.address}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No customer profile attached.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetail;
