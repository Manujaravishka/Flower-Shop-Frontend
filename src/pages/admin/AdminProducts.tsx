import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Search, Image as ImageIcon, Package } from "lucide-react";
import { giftApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import AdminLayout from "@/layouts/AdminLayout";

interface ProductImage {
  url: string;
  public_id: string;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  colour: string;
  size: string;
  category: string[];
  mediaUrl: ProductImage[];
}

interface ImageSlot {
  file: File | null;
  previewUrl: string | null;
  existing?: ProductImage;
  removeExisting?: boolean;
}

const MAX_SLOTS = 5;
const SIZE_OPTIONS = ["SMALL", "MEDIUM", "LARGE"];
const CATEGORY_OPTIONS = ["POT", "BOQUETS", "FLOWERS", "KEYTAG", "GIFTBOX"];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  colour: "",
  size: "SMALL",
  category: "POT",
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [slots, setSlots] = useState<ImageSlot[]>(
    Array.from({ length: MAX_SLOTS }, () => ({ file: null, previewUrl: null }))
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    return () => {
      slots.forEach((s) => s.previewUrl && URL.revokeObjectURL(s.previewUrl));
    };
  }, [slots]);

  const fetchProducts = async () => {
    try {
      const data = await giftApi.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    slots.forEach((s) => s.previewUrl && URL.revokeObjectURL(s.previewUrl));
    setEditing(null);
    setForm(emptyForm);
    setSlots(
      Array.from({ length: MAX_SLOTS }, () => ({ file: null, previewUrl: null }))
    );
  };

  const openCreate = () => {
    resetDialog();
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    resetDialog();
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      colour: p.colour ?? "",
      size: p.size ?? "SMALL",
      category: Array.isArray(p.category) && p.category.length > 0 ? p.category[0] : "POT",
    });
    setSlots(
      Array.from({ length: MAX_SLOTS }, (_, i) => {
        const existing = p.mediaUrl?.[i];
        return existing
          ? { file: null, previewUrl: null, existing }
          : { file: null, previewUrl: null };
      })
    );
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    resetDialog();
  };

  const handleSlotFile = (index: number, file: File | null) => {
    setSlots((prev) => {
      const next = [...prev];
      if (next[index].previewUrl) URL.revokeObjectURL(next[index].previewUrl!);
      next[index] = {
        ...next[index],
        file,
        previewUrl: file ? URL.createObjectURL(file) : null,
        removeExisting: false,
      };
      return next;
    });
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => {
      const next = [...prev];
      if (next[index].previewUrl) URL.revokeObjectURL(next[index].previewUrl!);
      next[index] = next[index].existing
        ? { file: null, previewUrl: null, existing: next[index].existing, removeExisting: true }
        : { file: null, previewUrl: null };
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    if (!form.colour.trim()) {
      toast.error("Colour is required");
      return;
    }
    if (!form.category) {
      toast.error("Category is required");
      return;
    }
    if (!editing && !slots.some((slot) => slot.file || slot.existing)) {
      toast.error("Please upload at least one image");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await giftApi.updateDetails(editing._id, {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          colour: form.colour,
          size: form.size,
          category: [form.category],
        });

        const removed = slots
          .filter((s) => s.existing && s.removeExisting)
          .map((s) => s.existing!);
        for (const img of removed) {
          await giftApi.deleteImages(editing._id, img.public_id);
        }

        const newFiles = slots.filter((s) => s.file);
        if (newFiles.length > 0) {
          const fd = new FormData();
          newFiles.forEach((s) => s.file && fd.append("image", s.file));
          await giftApi.updateImages(editing._id, fd);
        }
        toast.success("Product updated");
      } else {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description);
        fd.append("price", form.price);
        fd.append("colour", form.colour);
        fd.append("size", form.size);
        fd.append("category", form.category);
        slots.forEach((s) => s.file && fd.append("image", s.file));
        await giftApi.create(fd);
        toast.success("Product created");
      }
      closeDialog();
      fetchProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Product) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      for (const img of p.mediaUrl ?? []) {
        await giftApi.deleteImages(p._id, img.public_id);
      }
      await giftApi.delete(p._id);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed";
      toast.error(message);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.colour ?? "").toLowerCase().includes(q) ||
        (Array.isArray(p.category) ? p.category.join(" ") : "").toLowerCase().includes(q)
    );
  }, [products, search]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
              Products
            </h1>
            <p className="mt-1 text-muted-foreground">
              Curate every bouquet in the boutique.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              New product
            </Button>
          </div>
        </div>

        <Card className="border-cream-200/80 shadow-soft">
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>
              {filtered.length} product{filtered.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-16 flex items-center justify-center">
                <LuxurySpinner size={32} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Package className="w-10 h-10 mx-auto text-muted-foreground/50" strokeWidth={1.5} />
                <p className="mt-3 text-sm text-muted-foreground">No products match your search.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filtered.map((p) => (
                    <motion.div
                      key={p._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-2xl border border-cream-200/80 bg-white overflow-hidden shadow-soft"
                    >
                      <div className="aspect-[4/3] bg-cream-50 grid place-items-center overflow-hidden">
                        {p.mediaUrl?.[0]?.url ? (
                          <img
                            src={
                              p.mediaUrl[0].url.startsWith("http")
                                ? p.mediaUrl[0].url
                                : `http://localhost:3000${p.mediaUrl[0].url}`
                            }
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-10 h-10 text-muted-foreground/40" strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="p-4 space-y-1.5">
                        <p className="font-display text-lg text-foreground truncate">{p.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {p.description || "—"}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <p className="font-medium">Rs. {Number(p.price).toLocaleString()}</p>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(p)}
                              aria-label="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(p)}
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(o) => (o ? setDialogOpen(true) : closeDialog())}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (Rs.)</Label>
                <Input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="colour">Colour</Label>
                <Input
                  id="colour"
                  value={form.colour}
                  onChange={(e) => setForm({ ...form, colour: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Size</Label>
                <Select value={form.size} onValueChange={(v) => setForm({ ...form, size: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZE_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Images (up to {MAX_SLOTS})</Label>
              <div className="grid grid-cols-5 gap-2">
                {slots.map((slot, i) => {
                  const preview = slot.previewUrl ?? slot.existing?.url;
                  return (
                    <div
                      key={i}
                      className="aspect-square rounded-lg border border-dashed border-cream-300 bg-cream-50/40 relative overflow-hidden"
                    >
                      {preview ? (
                        <>
                          <img
                            src={preview}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeSlot(i)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs"
                            aria-label="Remove"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <label className="absolute inset-0 grid place-items-center text-xs text-muted-foreground cursor-pointer">
                          + Add
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleSlotFile(i, e.target.files?.[0] ?? null)
                            }
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : editing ? "Save changes" : "Create product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;
