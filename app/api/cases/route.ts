import { NextResponse } from 'next/server';
import { createCase, findCases } from '@/lib/database';

export async function GET() {
  try {
    const cases = await findCases();
    return NextResponse.json({
      status: 'success',
      data: cases,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Error fetching cases',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (
      !body.caseType ||
      !body.description ||
      !body.claimantId ||
      !body.oppositePartyId
    ) {
      return NextResponse.json(
        {
          status: 'error',
          message:
            'Required fields: caseType, description, claimantId, oppositePartyId',
        },
        { status: 400 }
      );
    }

    const caseData = await createCase(body);
    return NextResponse.json(
      {
        status: 'success',
        data: caseData,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Error creating case',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
