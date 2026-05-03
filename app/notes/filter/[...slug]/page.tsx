import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { Metadata } from "next";
import type { NoteTag } from "@/types/note";

interface PageProps {
  params: { slug?: string[] };
}

const isNoteTag = (value: string): value is NoteTag =>
  ["Todo", "Work", "Personal", "Meeting", "Shopping"].includes(value);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slugValue = params.slug?.[0];

  const filter =
    slugValue && slugValue !== "all" && isNoteTag(slugValue)
      ? slugValue
      : undefined;

  return {
    title: `Notes filtered by ${filter ?? "all"}`,
    description: `Viewing notes filtered by ${filter ?? "all"}`,
    openGraph: {
      title: `Notes filtered by ${filter ?? "all"}`,
      description: `Viewing notes filtered by ${filter ?? "all"}`,
      url: `/notes/filter/${filter ?? "all"}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function FilterPage({ params }: PageProps) {
  const slugValue = params.slug?.[0];

  const filter =
    slugValue && slugValue !== "all" && isNoteTag(slugValue)
      ? slugValue
      : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", filter],
    queryFn: () => fetchNotes(1, "", filter),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={filter} />
    </HydrationBoundary>
  );
}
