import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ book: string; chapter: string; verse: string }>;
  searchParams: Promise<{ t?: string }>;
}

export default async function OldVersePage({ params, searchParams }: PageProps) {
  const { book, chapter, verse } = await params;
  const { t } = await searchParams;
  redirect(`/${book}/${chapter}/${verse}${t ? `?t=${t}` : ""}`);
}
