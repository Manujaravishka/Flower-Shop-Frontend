import { useState, useEffect } from "react";
import { customerApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Users, Mail, Phone, MapPin } from "lucide-react";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

const CustomersTab = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await customerApi.getAll();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch customers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await customerApi.update({
          customerId: editingCustomer._id,
          ...formData,
        });
        toast.success("Customer updated successfully");
      } else {
        await customerApi.create(formData);
        toast.success("Customer created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
      fetchCustomers();
    } catch (error) {
      toast.error("Failed to save customer");
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (customerId: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await customerApi.delete(customerId);
      toast.success("Customer deleted successfully");
      fetchCustomers();
    } catch (error) {
      toast.error("Failed to delete customer");
    }
  };

  const resetForm = () => {
    setEditingCustomer(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
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
            Customers
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage your customer database
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="rounded-full text-primary-foreground shadow-soft hover:shadow-glow transition-all"
              style={{
                background:
                  "linear-gradient(135deg, #1B4332 0%, #2D5A45 50%, #C8A24A 130%)",
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-white border border-cream-200 shadow-elevated">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                {editingCustomer ? "Edit Customer" : "Add New Customer"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  required
                  className="bg-white border-cream-200 focus:border-primary/40"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  required
                  className="bg-white border-cream-200 focus:border-primary/40"
                />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="0712345678"
                  required
                  className="bg-white border-cream-200 focus:border-primary/40"
                />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="123 Main St, City"
                  required
                  className="bg-white border-cream-200 focus:border-primary/40"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full text-primary-foreground shadow-soft"
                style={{
                  background:
                    "linear-gradient(135deg, #1B4332 0%, #2D5A45 50%, #C8A24A 130%)",
                }}
              >
                {editingCustomer ? "Update Customer" : "Create Customer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {customers.length === 0 ? (
        <Card className="bg-white border border-cream-200 shadow-soft">
          <CardContent className="py-12 text-center">
            <Users
              className="w-12 h-12 mx-auto text-muted-foreground/60 mb-4"
              strokeWidth={1.2}
            />
            <p className="text-muted-foreground">
              No customers yet. Add your first customer!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white border border-cream-200 shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-cream-50/60 border-b border-cream-200">
                <TableHead className="text-ink-700 font-medium">Name</TableHead>
                <TableHead className="text-ink-700 font-medium">Email</TableHead>
                <TableHead className="text-ink-700 font-medium">Phone</TableHead>
                <TableHead className="text-ink-700 font-medium">Address</TableHead>
                <TableHead className="text-right text-ink-700 font-medium">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow
                  key={customer._id}
                  className="hover:bg-cream-50/60 border-b border-cream-200/60"
                >
                  <TableCell className="font-medium font-display">
                    {customer.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail
                        className="w-3.5 h-3.5 text-primary"
                        strokeWidth={1.8}
                      />
                      {customer.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone
                        className="w-3.5 h-3.5 text-primary"
                        strokeWidth={1.8}
                      />
                      {customer.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin
                        className="w-3.5 h-3.5 text-primary"
                        strokeWidth={1.8}
                      />
                      {customer.address}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(customer)}
                        className="hover:bg-cream-100"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-rose-deep hover:bg-rose/10"
                        onClick={() => handleDelete(customer._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default CustomersTab;
