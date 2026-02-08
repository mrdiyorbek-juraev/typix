import { notFound } from "next/navigation";
import ExampleDetailPage from "@/views/examples/detail";
import { examples, getExampleBySlug } from "@/views/examples/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return examples.map((e) => ({ slug: e.slug }));
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const example = getExampleBySlug(slug);

  if (!example) {
    notFound();
  }

  return <ExampleDetailPage example={example} />;
}
