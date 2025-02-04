import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  try {
    const { id, dish_Id } = resolvedParams;
    const dish = await prisma.dish.findFirst({
      where: { 
        id: dish_Id,
        restaurantId: id,
      },
    });
    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }
    return NextResponse.json(dish, { status: 200 });
  } catch (error) {
    console.error(`GET /api/restaurants/${(await params).id}/menu/${(await params).dish_Id} error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  // Upewnij się, że odpakowujemy parametry tylko raz
  const resolvedParams = await params;
  console.log('Resolved Params in PUT:', resolvedParams);
  const { id, dish_Id } = resolvedParams;
  
  try {
    const body = await request.json();
    const { name, price, description } = body;
    
    const updatedDish = await prisma.dish.updateMany({
      where: {
        id: dish_Id,
        restaurantId: id,
      },
      data: {
        name,
        price: parseFloat(price),
        description,
      },
    });
    
    if (!updatedDish.count) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }
    
    const dish = await prisma.dish.findUnique({ where: { id: dish_Id } });
    return NextResponse.json(dish, { status: 200 });
  } catch (error) {
    console.error(`PUT /api/restaurants/${id}/menu/${dish_Id} error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  try {
    const { id, dish_Id } = resolvedParams;

    const existingDish = await prisma.dish.findFirst({
      where: { id: dish_Id, restaurantId: id },
    });
    if (!existingDish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }

    await prisma.dish.delete({ where: { id: dish_Id } });
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error(`DELETE /api/restaurants/${(await params).id}/menu/${(await params).dish_Id} error:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
