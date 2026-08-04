import { NextRequest, NextResponse } from 'next/server';
import { movies } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const genre = searchParams.get('genre');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const type = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') || '24', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);

  let filtered = [...movies];

  if (genre) {
    filtered = filtered.filter((m) =>
      m.genres.some((g) => g.toLowerCase() === genre.toLowerCase()),
    );
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
        m.director.toLowerCase().includes(q) ||
        m.cast.some((c) => c.toLowerCase().includes(q)),
    );
  }

  if (featured === 'true') {
    filtered = filtered.filter((m) => m.featured);
    filtered.sort((a, b) => a.featuredOrder - b.featuredOrder);
  }

  if (type) {
    filtered = filtered.filter((m) => m.type === type);
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    movies: paginated,
    total,
    limit,
    offset,
  });
}
