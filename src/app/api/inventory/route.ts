import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface InventoryInput {
  sku: string;
  name: string;
  description?: string;
  quantity?: number | string;
  unitPrice: number | string;
  vendorId?: string;
}

// GET /api/inventory - Fetch all items
export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(items, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to fetch inventory:', errorMessage);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

// POST /api/inventory - Create a new item
export async function POST(request: Request) {
  try {
    const body = await request.json() as InventoryInput;
    const { sku, name, description, quantity, unitPrice, vendorId } = body;

    if (!sku || !name || unitPrice === undefined) {
      return NextResponse.json({ error: 'Missing required fields: sku, name, unitPrice' }, { status: 400 });
    }

    const item = await prisma.inventoryItem.create({
      data: {
        sku,
        name,
        description: description || null,
        quantity: Number(quantity) || 0,
        unitPrice: Number(unitPrice),
        vendorId: vendorId || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Failed to create inventory item:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}