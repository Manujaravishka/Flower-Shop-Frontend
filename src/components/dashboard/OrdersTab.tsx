import { useState, useEffect } from "react";
import { orderApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { toast } from "sonner";
import {
  ShoppingBag,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";

interface OrderItem {
  giftName: string;
  giftQty: number;
}

interface Order {
  _id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  status: string;
}

const statusConfig: Record<
  string,
  { icon: any; label: string; bg: string; text: string; border: string }
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

const OrdersTab = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderApi.getAll();
      setOrders(Array.isArray(data) ? data : []);
      console.log("Fetched orders:", data, "length:", orders.length);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await orderApi.updateStatus({
        orderId,
        status: newStatus,
      });
      if (!response.success) {
        toast.error("Failed to update order status");
      }
      toast.success("Order status updated");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LuxurySpinner size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-medium text-foreground">
            Orders
          </h2>
          <p className="text-muted-foreground text-sm">
            Track and manage customer orders
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="bg-white border border-cream-200 shadow-soft">
          <CardContent className="py-12 text-center">
            <ShoppingBag
              className="w-12 h-12 mx-auto text-muted-foreground/60 mb-4"
              strokeWidth={1.2}
            />
            <p className="text-muted-foreground">
              No orders yet. Orders will appear here when customers place them.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white border border-cream-200 shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-cream-50/60 border-b border-cream-200">
                <TableHead className="text-ink-700 font-medium">Order ID</TableHead>
                <TableHead className="text-ink-700 font-medium">Date</TableHead>
                <TableHead className="text-ink-700 font-medium">Items</TableHead>
                <TableHead className="text-ink-700 font-medium">Total</TableHead>
                <TableHead className="text-ink-700 font-medium">Status</TableHead>
                <TableHead className="text-right text-ink-700 font-medium">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <TableRow
                    key={order._id}
                    className="hover:bg-cream-50/60 border-b border-cream-200/60"
                  >
                    <TableCell className="font-mono text-sm">
                      #{order._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.orderDate)}
                    </TableCell>
                    <TableCell>
                      {order.items
                        .map((item) => `${item.giftName} x${item.giftQty}`)
                        .join(", ")}
                    </TableCell>
                    <TableCell className="font-display font-medium">
                      <span className="text-xs text-muted-foreground font-normal mr-0.5">
                        Rs.
                      </span>
                      {order.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="border-0 text-xs"
                        style={{
                          background: status.bg,
                          color: status.text,
                          border: `1px solid ${status.border}`,
                        }}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(order._id, value)
                        }
                      >
                        <SelectTrigger className="w-36 bg-white border-cream-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = orders.filter((o) => o.status === status).length;
          const Icon = config.icon;

          return (
            <Card
              key={status}
              className="bg-white border border-cream-200 shadow-soft"
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: config.bg,
                    border: `1px solid ${config.border}`,
                  }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: config.text }}
                    strokeWidth={1.8}
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {config.label}
                  </p>
                  <p className="font-display text-xl font-medium">{count}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersTab;
