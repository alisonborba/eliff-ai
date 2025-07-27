import { NextResponse } from 'next/server';
import { findUsers, createUser } from '@/lib/database';

export async function GET() {
  try {
    const users = await findUsers();
    return NextResponse.json({ status: 'success', data: users });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Error fetching users',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await createUser(body);
    return NextResponse.json({ status: 'success', data: user });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Error creating user',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
