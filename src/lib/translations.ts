export const TRANSLATIONS = [
  { id: "78a9f6124f344018-01", name: "New International Version", short: "NIV" },
  { id: "de4e12af7f28f599-02", name: "King James Version",        short: "KJV" },
  { id: "06125adad2d5898a-01", name: "American Standard Version",  short: "ASV" },
  { id: "9879dbb7cfe39e4d-04", name: "World English Bible",        short: "WEB" },
] as const;

export const DEFAULT_BIBLE_ID = "78a9f6124f344018-01";

export function getTranslationName(bibleId: string): string {
  return TRANSLATIONS.find((t) => t.id === bibleId)?.name ?? "New International Version";
}
