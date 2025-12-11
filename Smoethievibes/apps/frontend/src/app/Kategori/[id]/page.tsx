
import KategoriDetailClient from './KategoriDetailClient';

export default async function KategoriDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const categoryId = resolvedParams.id.toLowerCase();

  return <KategoriDetailClient categoryId={categoryId} />;
}