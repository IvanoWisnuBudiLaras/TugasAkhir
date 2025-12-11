import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function handleCategories(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization') || '';
    const { pathname, searchParams } = new URL(request.url);
    const path = pathname.replace('/api/categories/', '');
    
    const url = `${API_URL}/categories${path ? `/${path}` : ''}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const options: RequestInit = {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
    };

    if (request.method !== 'GET' && request.method !== 'DELETE') {
      const body = await request.text();
      if (body) {
        options.body = body;
      }
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: errorData || 'API request failed' },
        { status: response.status }
      );
    }

    const data = await response.text();
    const jsonData = data ? JSON.parse(data) : null;
    
    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleCategories(request);
}

export async function POST(request: NextRequest) {
  return handleCategories(request);
}

export async function PUT(request: NextRequest) {
  return handleCategories(request);
}

export async function DELETE(request: NextRequest) {
  return handleCategories(request);
}