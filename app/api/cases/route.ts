import { NextResponse } from 'next/server';
import { createCase, findCases, updateCase } from '@/lib/database';
import { sendEmail } from '../../../lib/sendEmail';

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
      !body.oppositePartyId ||
      !body.oppositePartyEmail
    ) {
      return NextResponse.json(
        {
          status: 'error',
          message:
            'Required fields: caseType, description, claimantId, oppositePartyId, oppositePartyEmail',
        },
        { status: 400 }
      );
    }

    const caseData = await createCase(body);

    if (caseData?.id && body.oppositePartyEmail) {
      const emailResponse = await sendEmail(body.oppositePartyEmail, 'New Case Created', `${process.env.NEXT_PUBLIC_APP_URL}/case/${caseData.id}`);
      console.log('emailResponse', emailResponse);

      if (emailResponse.error) {
        console.error('Error sending email', emailResponse.error);
      }

      if (emailResponse.data) {
        console.log('Email sent successfully', emailResponse.data);
        await updateCase(caseData.id, { status: 'AWAITING_RESPONSE' });
        console.log('Case status updated to AWAITING_RESPONSE');
      }
    }

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
