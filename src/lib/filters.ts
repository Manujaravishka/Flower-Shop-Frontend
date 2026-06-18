import { normalizedCategoryIncludes } from "./category";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  colour: string;
  size: string;
  category: string[];
  mediaUrl: { url: string; public_id: string; _id: string }[];
}

export type SortOption = "featured" | "price-asc" | "price-desc" | "name";

export interface FilterState {
  searchTerm: string;
  selectedCategory: string | null;
  selectedSize: string | null;
  sortBy: SortOption;
}

export function filterProducts(
  products: Product[],
  filters: FilterState
): Product[] {
  const { searchTerm, selectedCategory, selectedSize, sortBy } = filters;

  let filtered = products;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.colour.toLowerCase().includes(term)
    );
  }

  if (selectedCategory) {
    filtered = filtered.filter((p) =>
      normalizedCategoryIncludes(p.category, selectedCategory)
    );
  }

  if (selectedSize) {
    filtered = filtered.filter(
      (p) => typeof p.size === "string" && p.size.toUpperCase() === selectedSize
    );
  }

  if (sortBy === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  return filtered;
}

export function buildFilterParams(
  filters: FilterState
): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.searchTerm) params.q = filters.searchTerm;
  if (filters.selectedCategory) params.filter = filters.selectedCategory.toLowerCase();
  if (filters.selectedSize) params.size = filters.selectedSize.toLowerCase();
  if (filters.sortBy && filters.sortBy !== "featured") params.sort = filters.sortBy;
  return params;
}

export function parseFilterParams(
  searchParams: URLSearchParams
): FilterState {
  return {
    searchTerm: searchParams.get("q") ?? "",
    selectedCategory: searchParams.get("filter")?.toUpperCase() ?? null,
    selectedSize: searchParams.get("size")?.toUpperCase() ?? null,
    sortBy: (searchParams.get("sort") as SortOption) ?? "featured",
  };
}
