import { useEffect, useState, useMemo } from "react";
import { Search, UserPlus, Mail, Phone, MapPin, Users as UsersIcon } from "lucide-react";
import { customerApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import AdminLayout from "@/layouts/AdminLayout";
import { toast } from "sonner";

interface Customer {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const emptyForm = { name: "", email: "", phone: "", address: "" };

const AdminUsers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await customerApi.getAll();
      setCustomers(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        (c.name ?? "").toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.phone ?? "").toLowerCase().includes(q)
    );
  }, [customers, search]);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setSaving(true);
    try {
      await customerApi.create(form);
      toast.success("Customer created");
      setForm(emptyForm);
      setOpen(false);
      fetchCustomers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create customer";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
              Customers
            </h1>
            <p className="mt-1 text-muted-foreground">Customer profiles used at checkout.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search customers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button onClick={() => setOpen(true)} className="gap-2">
              <UserPlus className="w-4 h-4" />
              New customer
            </Button>
          </div>
        </div>

        <Card className="border-cream-200/80 shadow-soft">
          <CardHeader>
            <CardTitle>All customers</CardTitle>
            <CardDescription>
              {filtered.length} of {customers.length} customer
              {customers.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-16 flex items-center justify-center">
                <LuxurySpinner size={32} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <UsersIcon className="w-10 h-10 mx-auto text-muted-foreground/50" strokeWidth={1.5} />
                <p className="mt-3 text-sm text-muted-foreground">No customers match your search.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((c) => (
                  <div
                    key={c._id}
                    className="rounded-2xl border border-cream-200/80 bg-white p-4 shadow-soft"
                  >
                    <p className="font-display text-lg text-foreground truncate">
                      {c.name ?? "Unnamed"}
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {c.email && (
                        <p className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate">{c.email}</span>
                        </p>
                      )}
                      {c.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{c.phone}</span>
                        </p>
                      )}
                      {c.address && (
                        <p className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{c.address}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="cname">Name</Label>
              <Input
                id="cname"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cemail">Email</Label>
              <Input
                id="cemail"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cphone">Phone</Label>
              <Input
                id="cphone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caddress">Address</Label>
              <Textarea
                id="caddress"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? "Saving…" : "Create customer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
