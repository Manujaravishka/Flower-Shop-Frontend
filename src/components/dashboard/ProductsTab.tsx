import { useState, useEffect } from "react";
import { giftApi } from "@/lib/api";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Package, ImageIcon } from "lucide-react";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";

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

type ImageSlot = {
  file: File | null;
  previewUrl: string | null;
  existing?: ProductImage;
  removeExisting?: boolean;
};

const MAX_SLOTS = 5;

const ProductsTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    colour: "",
    size: "SMALL",
    category: "POT",
  });

  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(
    Array.from({ length: MAX_SLOTS }, () => ({ file: null, previewUrl: null }))
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await giftApi.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const cleanupPreviews = () => {
    setImageSlots((prev) => {
      prev.forEach((s) => {
        if (s.previewUrl) URL.revokeObjectURL(s.previewUrl);
      });
      return prev;
    });
  };

  const resetForm = () => {
    cleanupPreviews();
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      colour: "",
      size: "SMALL",
      category: "POT",
    });
    setImageSlots(
      Array.from({ length: MAX_SLOTS }, () => ({
        file: null,
        previewUrl: null,
      }))
    );
  };

  const handleEdit = (product: Product) => {
    cleanupPreviews();
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      colour: product.colour,
      size: product.size,
      category: product.category?.[0] || "POT",
    });
    setImageSlots(
      Array.from({ length: MAX_SLOTS }, (_, i) => ({
        file: null,
        previewUrl: null,
        existing: product.mediaUrl?.[i],
        removeExisting: false,
      }))
    );
    setIsDialogOpen(true);
  };

  const IMAGE_FIELD_KEY = "image";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await giftApi.updateDetails({
          giftId: editingProduct._id,
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          colour: formData.colour,
          size: formData.size,
          category: formData.category,
        });

        const publicIdsToDelete = imageSlots
          .filter((s) => s.existing && s.removeExisting)
          .map((s) => s.existing!.public_id);

        if (publicIdsToDelete.length > 0) {
          publicIdsToDelete.forEach(async (publicId) => {
            const deletingImg = await giftApi.deleteImages({
              giftId: editingProduct._id,
              publicId,
            });
            console.log("Deleted image response:", deletingImg);
          });
        }

        const newFiles = imageSlots
          .filter((s) => s.file)
          .map((s) => s.file!) as File[];

        if (newFiles.length > 0) {
          const fd = new FormData();
          fd.append("giftId", editingProduct._id);
          newFiles.forEach((file) => fd.append(IMAGE_FIELD_KEY, file));
          await giftApi.updateImages(fd);
        }

        toast.success("Product updated successfully");
      } else {
        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("description", formData.description);
        fd.append("price", formData.price);
        fd.append("colour", formData.colour);
        fd.append("size", formData.size);
        fd.append("category", formData.category);

        const filesToUpload = imageSlots
          .filter((s) => s.file)
          .map((s) => s.file!) as File[];

        filesToUpload.forEach((file) => fd.append(IMAGE_FIELD_KEY, file));
        await giftApi.create(fd);
        toast.success("Product created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      const fetchGifts = fetchProducts();
      console.log("Fetched gifts:", fetchGifts);
    } catch (error) {
      toast.error("Failed to save product");
    }
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
            Products
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage your flower arrangements and pots
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
              Add Product
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-lg bg-white border border-cream-200 shadow-elevated">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                {editingProduct ? "Edit Product" : "Add New Product"}
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
                  placeholder="Rose Bouquet"
                  required
                  className="bg-white border-cream-200 focus:border-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (Rs.)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="1500"
                    required
                    className="bg-white border-cream-200 focus:border-primary/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Colour</Label>
                  <Input
                    value={formData.colour}
                    onChange={(e) =>
                      setFormData({ ...formData, colour: e.target.value })
                    }
                    placeholder="Pink"
                    required
                    className="bg-white border-cream-200 focus:border-primary/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Size</Label>
                  <Select
                    value={formData.size}
                    onValueChange={(value) =>
                      setFormData({ ...formData, size: value })
                    }
                  >
                    <SelectTrigger className="bg-white border-cream-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SMALL">Small</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LARGE">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="bg-white border-cream-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POT">Pot</SelectItem>
                      <SelectItem value="BOQUETS">Bouquet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Beautiful handcrafted arrangement..."
                  className="bg-white border-cream-200 focus:border-primary/40"
                />
              </div>

              <div className="space-y-2">
                <Label>Images (max 5)</Label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imageSlots.map((slot, index) => {
                    const showUrl =
                      slot.previewUrl ?? slot.existing?.url ?? null;
                    const markedDelete =
                      !!slot.existing && !!slot.removeExisting;

                    return (
                      <div
                        key={index}
                        className="rounded-lg border border-cream-200 bg-white p-2"
                      >
                        <Input
                          id={`img-slot-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const input = e.currentTarget;
                            const file = input.files?.[0] ?? null;
                            if (!file) return;

                            const existingAfterDelete = imageSlots.filter(
                              (s) => s.existing && !s.removeExisting
                            ).length;
                            const newFilesOtherSlots = imageSlots.filter(
                              (s, i) => i !== index && !!s.file
                            ).length;
                            const total =
                              existingAfterDelete + newFilesOtherSlots + 1;
                            if (total > MAX_SLOTS) {
                              toast.error(
                                "You can upload only 5 images total."
                              );
                              input.value = "";
                              return;
                            }

                            const preview = URL.createObjectURL(file);

                            setImageSlots((prev) =>
                              prev.map((s, i) => {
                                if (i !== index) return s;
                                if (s.previewUrl) URL.revokeObjectURL(s.previewUrl);
                                return {
                                  ...s,
                                  file,
                                  previewUrl: preview,
                                  removeExisting: s.existing
                                    ? true
                                    : s.removeExisting,
                                };
                              })
                            );
                            input.value = "";
                          }}
                        />

                        <label
                          htmlFor={`img-slot-${index}`}
                          className="block cursor-pointer select-none"
                        >
                          <div className="relative aspect-square overflow-hidden rounded-md bg-cream-100">
                            {showUrl ? (
                              <img
                                src={showUrl}
                                alt={`image-${index + 1}`}
                                className={`h-full w-full object-cover ${
                                  markedDelete ? "opacity-40" : ""
                                }`}
                              />
                            ) : (
                              <div className="h-full w-full flex flex-col items-center justify-center text-xs text-muted-foreground gap-1">
                                <ImageIcon
                                  className="w-5 h-5 mb-1"
                                  strokeWidth={1.2}
                                />
                                <div className="font-medium">
                                  Click to upload
                                </div>
                                <div>Slot {index + 1}</div>
                              </div>
                            )}

                            <div className="absolute inset-x-0 bottom-0 flex items-end justify-center">
                              <div className="rounded-t bg-foreground/60 px-2 py-1 text-[11px] text-white">
                                {showUrl ? "Click to replace" : "Upload"}
                              </div>
                            </div>

                            {markedDelete && (
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white bg-black/40">
                                Marked for delete
                              </div>
                            )}
                          </div>
                        </label>

                        <div className="mt-2 flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-8 w-8 border-cream-200 text-rose-deep hover:bg-rose/10"
                            onClick={(ev) => {
                              ev.preventDefault();
                              ev.stopPropagation();
                              setImageSlots((prev) =>
                                prev.map((s, i) => {
                                  if (i !== index) return s;
                                  if (s.previewUrl) URL.revokeObjectURL(s.previewUrl);
                                  if (s.existing && !s.file) {
                                    return {
                                      ...s,
                                      removeExisting: !s.removeExisting,
                                    };
                                  }
                                  return { ...s, file: null, previewUrl: null };
                                })
                              );
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-muted-foreground">
                  Upload/Replace images per slot. Removing an existing image
                  marks it for deletion until you submit.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full rounded-full text-primary-foreground shadow-soft"
                style={{
                  background:
                    "linear-gradient(135deg, #1B4332 0%, #2D5A45 50%, #C8A24A 130%)",
                }}
              >
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <Card className="bg-white border border-cream-200 shadow-soft">
          <CardContent className="py-12 text-center">
            <Package
              className="w-12 h-12 mx-auto text-muted-foreground/60 mb-4"
              strokeWidth={1.2}
            />
            <p className="text-muted-foreground">
              No products yet. Add your first product!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product._id}
              className="overflow-hidden bg-white border border-cream-200/80 shadow-soft hover:shadow-card hover:border-primary/20 transition-all group"
            >
              <div className="relative aspect-square bg-cream-100">
                {product.mediaUrl && product.mediaUrl.length > 0 ? (
                  <img
                    src={product.mediaUrl[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(27,67,50,0.12), rgba(244,194,194,0.25))",
                    }}
                  >
                    <span className="text-5xl">🌸</span>
                  </div>
                )}

                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleEdit(product)}
                    className="bg-white/95 border border-cream-200 hover:bg-white shadow-soft"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.category.map((cat) => (
                    <Badge
                      key={cat}
                      variant="secondary"
                      className="text-xs bg-cream-100 text-ink-700 border border-cream-200"
                    >
                      {cat}
                    </Badge>
                  ))}
                  <Badge
                    className="text-xs text-ink-900 border-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(200,162,74,0.2), rgba(200,162,74,0.1))",
                      border: "1px solid rgba(200,162,74,0.35)",
                    }}
                  >
                    {product.size}
                  </Badge>
                </div>
                <h3 className="font-display font-medium text-foreground line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {product.colour}
                </p>
                <p className="font-display text-lg font-medium text-foreground mt-1">
                  <span className="text-xs text-muted-foreground font-normal mr-0.5">
                    Rs.
                  </span>
                  {product.price.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsTab;
