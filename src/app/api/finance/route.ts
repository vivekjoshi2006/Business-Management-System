import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface FinanceInput {
  type: string;
  amount: number | string;
  category: string;
  description?: string;
  clientVendorId?: string;
}

export async function GET() {
  try {
    const transactions = await prisma.financeTransaction.findMany({
      include: { clientVendor: true },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(transactions, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as FinanceInput;
    const { type, amount, category, description, clientVendorId } = body;

    if (!type || !amount || !category) {
      return NextResponse.json({ error: 'Type, amount, and category are required' }, { status: 400 });
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount)) {
      return NextResponse.json({ error: 'Amount must be a valid number' }, { status: 400 });
    }

    const transaction = await prisma.financeTransaction.create({
      data: {
        type, 
        amount: parsedAmount,
        category,
        description: description || null,
        clientVendorId: clientVendorId || null,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}