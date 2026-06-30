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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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

    const updated = await prisma.contact.update({
      where: { id },
      data: { name, phone, email, company, category, notes },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}