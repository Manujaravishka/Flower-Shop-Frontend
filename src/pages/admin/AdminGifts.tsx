import { useEffect, useState, useMemo } from "react";
import { Search, Image as ImageIcon, Sparkles } from "lucide-react";
import { libraryApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import AdminLayout from "@/layouts/AdminLayout";

interface LibraryImage {
  _id: string;
  title?: string;
  imageUrl: string;
  publicId?: string;
  url?: string;
}

function normalize(payload: unknown): LibraryImage[] {
  if (Array.isArray(payload)) return payload as LibraryImage[];
  if (payload && typeof payload === "object") {
    const obj = payload as { data?: LibraryImage[] };
    if (Array.isArray(obj.data)) return obj.data;
  }
  return [];
}

const AdminGifts = () => {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const data = await libraryApi.getAll();
        setImages(normalize(data));
      } catch {
        // soft fail; gift library is a supplemental view
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return images;
    return images.filter((i) => (i.title ?? "").toLowerCase().includes(q));
  }, [images, search]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
              Custom bouquets
            </h1>
            <p className="mt-1 text-muted-foreground">
              Library of styled arrangements the atelier can reuse.
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search library"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>

        <Card className="border-cream-200/80 shadow-soft">
          <CardHeader>
            <CardTitle>Library</CardTitle>
            <CardDescription>
              {filtered.length} image{filtered.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-16 flex items-center justify-center">
                <LuxurySpinner size={32} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Sparkles className="w-10 h-10 mx-auto text-muted-foreground/50" strokeWidth={1.5} />
                <p className="mt-3 text-sm text-muted-foreground">No library images match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((img) => {
                  const src = img.url ?? img.imageUrl;
                  return (
                    <div
                      key={img._id}
                      className="rounded-2xl overflow-hidden border border-cream-200/80 bg-white shadow-soft"
                    >
                      <div className="aspect-square bg-cream-50 grid place-items-center overflow-hidden">
                        {src ? (
                          <img src={src} alt={img.title ?? ""} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-10 h-10 text-muted-foreground/40" strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-foreground truncate">
                          {img.title ?? "Untitled"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminGifts;
