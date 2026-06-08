import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import { apiClient } from "@/lib/axios";
import { orderApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Clock, Package, Truck, CheckCircle, XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  giftId?: string;
  giftName?: string;
  name?: string;
  productName?: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  status: string;
  customerId?: string;
}

interface Customer {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

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
    bg: "rgba(74,29,107,0.1)",
    text: "#4A1D6B",
    border: "rgba(74,29,107,0.25)",
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
    bg: "rgba(74,29,107,0.18)",
    text: "#1F0D33",
    border: "rgba(74,29,107,0.4)",
  },
  cancelled: {
    icon: XCircle,
    label: "Cancelled",
    bg: "rgba(212,121,121,0.12)",
    text: "#7A2A2A",
    border: "rgba(212,121,121,0.3)",
  },
};

function extractOrder(payload: unknown): Order | null {
  if (!payload) return null;
  if (Array.isArray(payload)) return (payload[0] as Order) ?? null;
  if (typeof payload === "object") {
    const obj = payload as { data?: Order | Order[] };
    if (Array.isArray(obj.data)) return obj.data[0] ?? null;
    if (obj.data && typeof obj.data === "object") return obj.data as Order;
    return payload as Order;
  }
  return null;
}

function extractCustomer(payload: unknown): Customer | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as { data?: Customer };
  if (obj.data && typeof obj.data === "object") return obj.data;
  return payload as Customer;
}

const AccountOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const run = async () => {
      try {
        const { data } = await apiClient.get(`/customer/orders/${id}`);
        if (cancelled) return;
        const found = extractOrder(data?.data ?? data);
        if (!found) {
          setError("Order not found");
          return;
        }
        setOrder(found);

        try {
          const meRes = await apiClient.get("/auth/me");
          if (!cancelled) {
            setCustomer(extractCustomer(meRes.data?.data ?? meRes.data));
          }
        } catch {
          // Delivery profile is best-effort; ignore failures.
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

  const handleCancel = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      await orderApi.cancel(order._id);
      setOrder({ ...order, status: "cancelled" });
      toast.success("Order cancelled successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Cancel failed";
      toast.error(message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <LuxurySpinner size={32} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" className="gap-2">
          <Link to="/account/orders">
            <ArrowLeft className="w-4 h-4" />
            Back to orders
          </Link>
        </Button>
        <p className="text-sm text-muted-foreground">{error ?? "Order not found"}</p>
      </div>
    );
  }

  const cfg = statusConfig[order.status] ?? statusConfig.pending;
  const StatusIcon = cfg.icon;

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="gap-2 -ml-2">
        <Link to="/account/orders">
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
          {(order.status === "pending" || order.status === "processing") && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={cancelling}
              className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
            >
              {cancelling ? "Cancelling..." : "Cancel order"}
            </Button>
          )}
        </div>
      </div>

      <Card className="border-cream-200/80 shadow-soft">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-cream-200/70">
            {order.items.map((item, idx) => {
              const name =
                item.giftName ?? item.name ?? item.productName ?? "Bouquet";
              return (
                <li key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    Rs. {Number(item.price ?? 0).toLocaleString()}
                  </p>
                </li>
              );
            })}
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
          <CardTitle>Delivery</CardTitle>
          <CardDescription>Where this order will be delivered.</CardDescription>
        </CardHeader>
        <CardContent>
          {customer ? (
            <div className="space-y-1">
              <p className="font-medium text-foreground">{customer.name}</p>
              {customer.email && (
                <p className="text-sm text-muted-foreground">{customer.email}</p>
              )}
              {customer.phone && (
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              )}
              {customer.address && (
                <p className="text-sm text-muted-foreground whitespace-pre-line pt-2">
                  {customer.address}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Delivery details will appear once they are confirmed.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountOrderDetail;
