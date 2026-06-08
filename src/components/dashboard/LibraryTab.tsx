import { useState, useEffect } from "react";
import { libraryApi } from "@/lib/api";
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
import { toast } from "sonner";
import { Plus, Edit, Trash2, Image as ImageIcon, Search, X } from "lucide-react";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";

interface LibraryItem {
  _id: string;
  title: string;
  imageUrl?: string;
  url?: string;
  publicId?: string;
}

const LibraryTab = () => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await libraryApi.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch library items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchItems();
      return;
    }
    try {
      const data = await libraryApi.findByName(searchTerm);
      if (Array.isArray(data)) {
        setItems(data);
      } else if (data && typeof data === "object" && "libraries" in data) {
        setItems((data as { libraries: LibraryItem[] }).libraries);
      } else {
        setItems([]);
      }
    } catch (error) {
      toast.error("Search failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await libraryApi.updateTitle(editingItem._id, title);
        toast.success("Library item updated");
      } else {
        const formData = new FormData();
        formData.append("title", title);
        if (imageFile) {
          formData.append("image", imageFile);
        }
        await libraryApi.create(formData);
        toast.success("Library item created");
      }
      setIsDialogOpen(false);
      resetForm();
      fetchItems();
    } catch (error) {
      toast.error("Failed to save library item");
    }
  };

  const handleEdit = (item: LibraryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setIsDialogOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await libraryApi.delete(itemId);
      toast.success("Library item deleted");
      fetchItems();
    } catch (error) {
      toast.error("Failed to delete library item");
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setTitle("");
    setImageFile(null);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-medium text-foreground">
            Image Library
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage your inspiration gallery
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
                  "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-white border border-cream-200 shadow-elevated">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                {editingItem ? "Edit Image" : "Add New Image"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Beautiful Sunflower Arrangement"
                  required
                  className="bg-white border-cream-200 focus:border-primary/40"
                />
              </div>

              {!editingItem && (
                <div className="space-y-2">
                  <Label>Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    required
                    className="bg-white border-cream-200 focus:border-primary/40"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full rounded-full text-primary-foreground shadow-soft"
                style={{
                  background:
                    "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                }}
              >
                {editingItem ? "Update Image" : "Upload Image"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            strokeWidth={1.8}
          />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by title..."
            className="pl-11 bg-white border-cream-200 focus:border-primary/40"
          />
        </div>
        <Button
          onClick={handleSearch}
          variant="outline"
          className="rounded-full border-cream-200 hover:bg-cream-50 hover:border-primary/30"
        >
          Search
        </Button>
        {searchTerm && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm("");
              fetchItems();
            }}
            className="rounded-full hover:bg-cream-100"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <Card className="bg-white border border-cream-200 shadow-soft">
          <CardContent className="py-12 text-center">
            <ImageIcon
              className="w-12 h-12 mx-auto text-muted-foreground/60 mb-4"
              strokeWidth={1.2}
            />
            <p className="text-muted-foreground">
              {searchTerm
                ? "No images found matching your search."
                : "No images in library yet. Add your first image!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => {
            const imageSrc = item.url ?? item.imageUrl;
            return (
            <Card
              key={item._id}
              className="overflow-hidden bg-white border border-cream-200/80 shadow-soft hover:shadow-card hover:border-primary/20 transition-all group"
            >
              <div
                className="relative aspect-square bg-cream-100 cursor-pointer"
                onClick={() => imageSrc && setSelectedImage(imageSrc)}
              >
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(74,29,107,0.12), rgba(244,194,194,0.25))",
                    }}
                  >
                    <ImageIcon className="w-10 h-10 text-foreground/40" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                    className="bg-white/95 border border-cream-200 hover:bg-white shadow-soft"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-white/95 border border-cream-200 text-rose-deep hover:bg-white shadow-soft"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-display font-medium text-foreground line-clamp-2">
                  {item.title}
                </h3>
              </CardContent>
            </Card>
            );
          })}
        </div>
      )}

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-foreground/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 text-white hover:bg-white/15"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </Button>
          <img
            src={selectedImage}
            alt="Library preview"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default LibraryTab;
