import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0];
  const filter = tag && tag !== "all" ? tag : undefined;

  return {
    title: `Notes filtered by ${filter}`,
    description: `Viewing notes filtered by ${filter}`,
    openGraph: {
      title: `Notes filtered by ${filter}`,
      description: `Viewing notes filtered by ${filter}`,
      url: `/notes/filter/${filter}`,
      images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
    },
  };
}

export default async function FilterPage({ params }: PageProps) {
  const { slug } = await params;
  const tag = slug?.[0];
  const filter = tag && tag !== "all" ? tag : undefined;

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
