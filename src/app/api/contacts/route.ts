import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ContactInput {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  category: string;
  notes?: string;
}

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(contacts, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as ContactInput;
    const { name, phone, email, company, category, notes } = body;

    if (!name || !phone || !category) {
      return NextResponse.json({ error: 'Name, phone, and category are required' }, { status: 400 });
    }

    // Phone validation: Only allow digits
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: 'Phone number must contain only numbers (0-9).' }, { status: 400 });
    }

    const newContact = await prisma.contact.create({
      data: { name, phone, email, company, category, notes },
    });

    return NextResponse.json(newContact, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}