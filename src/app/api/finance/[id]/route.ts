import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface FinanceInput {
  type: string;
  amount: number | string;
  category: string;
  description?: string;
  clientVendorId?: string;
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json() as FinanceInput;
    const { type, amount, category, description, clientVendorId } = body;

    if (!type || !amount || !category) {
      return NextResponse.json({ error: 'Type, amount, and category are required' }, { status: 400 });
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount)) {
      return NextResponse.json({ error: 'Amount must be a valid number' }, { status: 400 });
    }

    const updated = await prisma.financeTransaction.update({
      where: { id },
      data: {
        type,
        amount: parsedAmount,
        category,
        description: description || null,
        clientVendorId: clientVendorId || null,
      },
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
    await prisma.financeTransaction.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}