import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import { orderApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingBag, Package, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface OrdersResponse {
  data?: Order[];
  success?: boolean;
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

function extractOrders(payload: unknown): Order[] {
  if (Array.isArray(payload)) return payload as Order[];
  if (payload && typeof payload === "object") {
    const obj = payload as OrdersResponse;
    if (Array.isArray(obj.data)) return obj.data;
  }
  return [];
}

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const AccountOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const data = await orderApi.getMine();
        if (cancelled) return;
        setOrders(extractOrders(data));
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load orders";
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
          My orders
        </h1>
        <p className="mt-1 text-muted-foreground">Track and revisit every bouquet you have ordered.</p>
      </div>

      <Card className="border-cream-200/80 shadow-soft">
        <CardHeader>
          <CardTitle>Order history</CardTitle>
          <CardDescription>
            {orders.length === 0
              ? "You have not placed any orders yet."
              : `${orders.length} order${orders.length === 1 ? "" : "s"} on file`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <LuxurySpinner size={32} />
            </div>
          ) : error ? (
            <div className="py-12 text-center text-sm text-muted-foreground">{error}</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingBag className="w-10 h-10 mx-auto text-muted-foreground/50" strokeWidth={1.5} />
              <p className="mt-3 text-sm text-muted-foreground">
                When you place an order it will appear here.
              </p>
              <Link
                to="/products"
                className="inline-block mt-4 text-sm font-medium text-primary hover:underline"
              >
                Browse the boutique →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const cfg = statusConfig[order.status] ?? statusConfig.pending;
                    const StatusIcon = cfg.icon;
                    return (
                      <TableRow key={order._id} className="hover:bg-cream-50/50">
                        <TableCell>
                          <Link
                            to={`/account/orders/${order._id}`}
                            className="font-medium text-foreground hover:text-primary"
                          >
                            #{order._id.slice(-8).toUpperCase()}
                          </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(order.orderDate)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {order.items?.length ?? 0}
                        </TableCell>
                        <TableCell className="font-medium">
                          Rs. {Number(order.totalAmount ?? 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="gap-1.5"
                            style={{
                              background: cfg.bg,
                              color: cfg.text,
                              borderColor: cfg.border,
                            }}
                          >
                            <StatusIcon className="w-3 h-3" strokeWidth={2} />
                            {cfg.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountOrders;
