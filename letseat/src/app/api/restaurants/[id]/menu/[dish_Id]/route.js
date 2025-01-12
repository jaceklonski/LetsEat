import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id, dishId } = params;
    const dish = await prisma.dish.findFirst({
      where: { 
        id: dishId,
        restaurantId: id
      },
    });
    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }
    return NextResponse.json(dish, { status: 200 });
  } catch (error) {
    console.error(
      `GET /api/restaurants/${params.id}/menu/${params.dishId} error:`,
      error
    );
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id, dishId } = params;
    const body = await request.json();
    const { name, price, discriprion } = body;

    const updatedDish = await prisma.dish.updateMany({
      where: {
        id: dishId,
        restaurantId: id,
      },
      data: {
        name,
        price,
        discriprion,
      },
    });

    if (!updatedDish.count) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }

    const dish = await prisma.dish.findUnique({ where: { id: dishId } });
    return NextResponse.json(dish, { status: 200 });
  } catch (error) {
    console.error(
      `PUT /api/restaurants/${params.id}/menu/${params.dishId} error:`,
      error
    );
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id, dishId } = params;

    const existingDish = await prisma.dish.findFirst({
      where: { id: dishId, restaurantId: id },
    });
    if (!existingDish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }

    await prisma.dish.delete({ where: { id: dishId } });
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error(
      `DELETE /api/restaurants/${params.id}/menu/${params.dishId} error:`,
      error
    );
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
