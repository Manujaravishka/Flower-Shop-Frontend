import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Search, Image as ImageIcon, Sparkles } from "lucide-react";
import { libraryApi } from "@/lib/api";
import { env } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import AdminLayout from "@/layouts/AdminLayout";

interface LibraryMedia {
  url: string;
  public_id: string;
}

interface LibraryItem {
  _id: string;
  title: string;
  mediaUrl: LibraryMedia[];
  createdAt: string;
  updatedAt: string;
}

interface ImageSlot {
  file: File | null;
  previewUrl: string | null;
  existing?: LibraryMedia;
  removeExisting?: boolean;
}

const MAX_SLOTS = 3;

const AdminGifts = () => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<LibraryItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slots, setSlots] = useState<ImageSlot[]>(
    Array.from({ length: MAX_SLOTS }, () => ({ file: null, previewUrl: null }))
  );

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    return () => {
      slots.forEach((s) => s.previewUrl && URL.revokeObjectURL(s.previewUrl));
    };
  }, [slots]);

  const fetchItems = async () => {
    try {
      const data = await libraryApi.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    slots.forEach((s) => s.previewUrl && URL.revokeObjectURL(s.previewUrl));
    setEditing(null);
    setTitle("");
    setSlots(
      Array.from({ length: MAX_SLOTS }, () => ({ file: null, previewUrl: null }))
    );
  };

  const openCreate = () => {
    resetDialog();
    setDialogOpen(true);
  };

  const openEdit = (item: LibraryItem) => {
    resetDialog();
    setEditing(item);
    setTitle(item.title);
    setSlots(
      Array.from({ length: MAX_SLOTS }, (_, i) => {
        const existing = item.mediaUrl?.[i];
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
        ? {
            file: null,
            previewUrl: null,
            existing: next[index].existing,
            removeExisting: true,
          }
        : { file: null, previewUrl: null };
      return next;
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!editing && !slots.some((s) => s.file || s.existing)) {
      toast.error("Please upload at least one image");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await libraryApi.updateTitle(editing._id, title.trim());

        const removed = slots.filter((s) => s.existing && s.removeExisting);
        for (const slot of removed) {
          await libraryApi.deleteImage(editing._id, slot.existing!.public_id);
        }

        const newFiles = slots.filter((s) => s.file);
        if (newFiles.length > 0) {
          const fd = new FormData();
          newFiles.forEach((s) => s.file && fd.append("image", s.file));
          await libraryApi.updateImages(editing._id, fd);
        }
        toast.success("Composition updated");
      } else {
        const fd = new FormData();
        fd.append("title", title.trim());
        slots.forEach((s) => s.file && fd.append("image", s.file));
        await libraryApi.create(fd);
        toast.success("Composition created");
      }
      closeDialog();
      fetchItems();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: LibraryItem) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    try {
      await libraryApi.delete(item._id);
      toast.success("Composition deleted");
      fetchItems();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed";
      toast.error(message);
    }
  };

  const resolveImageUrl = (url: string) =>
    url.startsWith("http") ? url : `${env.apiBaseUrl.replace("/api/v1", "")}${url}`;

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((i) => i.title.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
              Gallery
            </h1>
            <p className="mt-1 text-muted-foreground">
              Curate compositions for the public gallery.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search compositions"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              New composition
            </Button>
          </div>
        </div>

        <Card className="border-cream-200/80 shadow-soft">
          <CardHeader>
            <CardTitle>Compositions</CardTitle>
            <CardDescription>
              {filtered.length} composition{filtered.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-16 flex items-center justify-center">
                <LuxurySpinner size={32} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Sparkles
                  className="w-10 h-10 mx-auto text-muted-foreground/50"
                  strokeWidth={1.5}
                />
                <p className="mt-3 text-sm text-muted-foreground">
                  {search
                    ? "No compositions match your search."
                    : "No compositions yet. Create your first one."}
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filtered.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-2xl border border-cream-200/80 bg-white overflow-hidden shadow-soft"
                    >
                      <div className="aspect-[4/3] bg-cream-50 grid place-items-center overflow-hidden">
                        {item.mediaUrl?.[0]?.url ? (
                          <img
                            src={resolveImageUrl(item.mediaUrl[0].url)}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon
                            className="w-10 h-10 text-muted-foreground/40"
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <p className="font-display text-lg text-foreground truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.mediaUrl?.length || 0} image
                          {(item.mediaUrl?.length || 0) === 1 ? "" : "s"}
                        </p>
                        <div className="flex items-center justify-end gap-1 pt-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(item)}
                            aria-label="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item)}
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
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

      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => (o ? setDialogOpen(true) : closeDialog())}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit composition" : "New composition"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Autumn Garden Bouquet"
              />
            </div>

            <div className="space-y-2">
              <Label>Images (up to {MAX_SLOTS})</Label>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot, i) => {
                  const preview = slot.previewUrl ?? slot.existing?.url;
                  const isRemoved = slot.existing && slot.removeExisting;
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg border border-dashed border-cream-300 bg-cream-50/40 relative overflow-hidden ${
                        isRemoved ? "opacity-40 ring-2 ring-destructive" : ""
                      }`}
                    >
                      {preview && !isRemoved ? (
                        <>
                          <img
                            src={
                              resolveImageUrl(preview)
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeSlot(i)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs grid place-items-center"
                            aria-label="Remove"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <label className="absolute inset-0 grid place-items-center text-xs text-muted-foreground cursor-pointer">
                          {isRemoved ? "Removed" : "+ Add"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleSlotFile(i, e.target.files?.[0] ?? null)
                            }
                            disabled={isRemoved}
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
              {saving
                ? "Saving…"
                : editing
                ? "Save changes"
                : "Create composition"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminGifts;
