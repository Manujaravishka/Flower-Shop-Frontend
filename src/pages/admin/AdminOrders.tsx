import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import { orderApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import AdminLayout from "@/layouts/AdminLayout";
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

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderApi.getAll();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      await orderApi.updateStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
      toast.success(`Order marked as ${status}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        o._id.toLowerCase().includes(q) ||
        o.customerId.toLowerCase().includes(q) ||
        (o.items ?? []).some((i) => (i.giftName ?? i.name ?? "").toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
            Orders
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track every order flowing through the atelier.
          </p>
        </div>

        <Card className="border-cream-200/80 shadow-soft">
          <CardHeader>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <CardTitle>All orders</CardTitle>
                <CardDescription>
                  {filtered.length} of {orders.length} order
                  {orders.length === 1 ? "" : "s"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 w-56"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusConfig[s]?.label ?? s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-16 flex items-center justify-center">
                <LuxurySpinner size={32} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag className="w-10 h-10 mx-auto text-muted-foreground/50" strokeWidth={1.5} />
                <p className="mt-3 text-sm text-muted-foreground">No orders match your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Update</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((order) => {
                      const cfg = statusConfig[order.status] ?? statusConfig.pending;
                      const StatusIcon = cfg.icon;
                      return (
                        <TableRow key={order._id} className="hover:bg-cream-50/50">
                          <TableCell>
                            <Link
                              to={`/admin/orders/${order._id}`}
                              className="font-medium text-foreground hover:text-primary"
                            >
                              #{order._id.slice(-8).toUpperCase()}
                            </Link>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(order.orderDate)}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {order.customerId.slice(-8).toUpperCase()}
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
                          <TableCell className="text-right">
                            <Select
                              value={order.status}
                              onValueChange={(v) => updateStatus(order._id, v)}
                              disabled={updatingId === order._id}
                            >
                              <SelectTrigger className="w-36 ml-auto">
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
    </AdminLayout>
  );
};

export default AdminOrders;
