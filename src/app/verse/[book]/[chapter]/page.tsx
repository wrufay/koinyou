import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ book: string; chapter: string }>;
  searchParams: Promise<{ t?: string }>;
}

export default async function OldChapterPage({ params, searchParams }: PageProps) {
  const { book, chapter } = await params;
  const { t } = await searchParams;
  redirect(`/${book}/${chapter}${t ? `?t=${t}` : ""}`);
}
