const CATEGORY_SYNONYMS: Record<string, string> = {
  BOUQUET: "BOQUETS",
  BOUQUETS: "BOQUETS",
  BOQUETS: "BOQUETS",
  "GIFT BOX": "GIFTBOX",
  GIFTBOX: "GIFTBOX",
  "KEY TAG": "KEYTAG",
  KEYTAG: "KEYTAG",
  POT: "POT",
  FLOWERS: "FLOWERS",
};

export const CATEGORY_VALUES = Object.values(CATEGORY_SYNONYMS).filter(
  (v, i, a) => a.indexOf(v) === i
);

export const normalizeCategoryString = (value: string): string => {
  const normalized = value.trim().toUpperCase().replace(/\s+/g, " ");
  if (!normalized) return "";
  return CATEGORY_SYNONYMS[normalized] ?? normalized;
};

export const normalizeCategories = (value: unknown): string[] => {
  const items = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? [value]
      : [];

  return Array.from(
    new Set(
      items
        .filter((item): item is string => typeof item === "string")
        .map(normalizeCategoryString)
        .filter((item) => item !== "")
    )
  );
};

export const normalizedCategoryIncludes = (
  category: unknown,
  expected: string
): boolean => {
  const normalizedExpected = normalizeCategoryString(expected);
  if (!normalizedExpected) return false;
  return normalizeCategories(category).includes(normalizedExpected);
};
