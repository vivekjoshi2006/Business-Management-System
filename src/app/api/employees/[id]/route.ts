import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface EmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: string;
  department: string;
  salary: number | string;
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json() as EmployeeInput;
    const { firstName, lastName, email, phone, role, department, salary } = body;

    if (!firstName || !lastName || !email || !phone || !salary || !department) {
      return NextResponse.json({ error: 'Missing required profile fields' }, { status: 400 });
    }

    // Phone validation: Only allow digits
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: 'Phone number must contain only numbers (0-9).' }, { status: 400 });
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        role: role || 'STAFF',
        department,
        salary: Number(salary),
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
    await prisma.employee.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}