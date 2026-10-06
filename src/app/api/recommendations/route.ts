import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_RECOMMENDATIONS } from '@/utils/apiData';
import { Category } from '@/types/content';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as Category | null;
    const subType = searchParams.get('subType');
    const search = searchParams.get('search')?.toLowerCase() || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    let items = [...INITIAL_RECOMMENDATIONS];

    if (category && category !== ('all' as Category)) {
      items = items.filter((item) => item.category === category);
    }

    if (subType) {
      items = items.filter((item) => item.subType === subType);
    }

    if (search) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          (item.creatorOrArtist && item.creatorOrArtist.toLowerCase().includes(search))
      );
    }

    const total = items.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: startIndex + limit < total,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
