import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_CONFIG } from '@/config/token';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Lấy token từ header Authorization
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    const token = authHeader.substring(7); // Loại bỏ 'Bearer ' prefix

    // Lấy ID từ params
    const id = context.params.id;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Log request URL for debugging
    console.log('Fetching product with ID:', id);
    console.log('Requesting URL:', `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from backend:', errorData);
      return NextResponse.json(
        { success: false, message: errorData.message || 'Failed to fetch product' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to fetch product' },
      { status: 500 }
    );
  }
} 