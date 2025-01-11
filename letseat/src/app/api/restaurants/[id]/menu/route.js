// src/app/api/restaurants/[id]/menu/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params; // id restauracji

    // Pobierz listę dań należących do restauracji o danym id
    const dishes = await prisma.dish.findMany({
      where: { restaurantId: id },
    });

    return NextResponse.json(dishes, { status: 200 });
  } catch (error) {
    console.error(`GET /api/restaurants/${params.id}/menu error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params; // id restauracji
    const body = await request.json();
    const { name, price } = body;

    // Dodaj nowe danie do restauracji
    const newDish = await prisma.dish.create({
      data: {
        name,
        price,
        restaurantId: id,
      },
    });

    return NextResponse.json(newDish, { status: 201 });
  } catch (error) {
    console.error(`POST /api/restaurants/${params.id}/menu error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
