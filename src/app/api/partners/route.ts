import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface PartnerInput {
  name: string;
  type: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  taxId?: string;
}

export async function GET() {
  try {
    const partners = await prisma.clientVendor.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(partners, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as PartnerInput;
    const { name, type, email, phone, address, companyName, taxId } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
    }

    // Phone validation: Only allow digits if a phone number is provided
    if (phone) {
      const phoneRegex = /^[0-9]+$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json({ error: 'Phone number must contain only numbers (0-9).' }, { status: 400 });
      }
    }

    const partner = await prisma.clientVendor.create({
      data: {
        name,
        type,
        email: email || null,
        phone: phone || null,
        address: address || null,
        companyName: companyName || null,
        taxId: taxId || null,
      },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}