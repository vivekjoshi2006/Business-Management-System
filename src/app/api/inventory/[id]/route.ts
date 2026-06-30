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

// PUT /api/inventory/[id] - Update an item
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json() as InventoryInput;
    const { sku, name, description, quantity, unitPrice, vendorId } = body;

    if (!sku || !name || unitPrice === undefined) {
      return NextResponse.json({ error: 'Missing required fields: sku, name, unitPrice' }, { status: 400 });
    }

    const updated = await prisma.inventoryItem.update({
      where: { id },
      data: {
        sku,
        name,
        description: description || null,
        quantity: Number(quantity) || 0,
        unitPrice: Number(unitPrice),
        vendorId: vendorId || null,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE /api/inventory/[id] - Delete an item
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.inventoryItem.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}