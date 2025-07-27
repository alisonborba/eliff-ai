import { NextResponse } from 'next/server';
import { findCase } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseData = await findCase(id);

    if (!caseData) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Case not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: caseData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Error fetching case',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
