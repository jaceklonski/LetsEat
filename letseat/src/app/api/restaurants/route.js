import { NextResponse } from 'next/server';
import prisma from '';

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany();
    return NextResponse.json(restaurants, { status: 200 });
  } catch (error) {
    console.error('GET /api/restaurants error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, address, cuisine } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    const newRestaurant = await prisma.restaurant.create({
      data: {
        name,
        address,
        cuisine
      }
    });

    return NextResponse.json(newRestaurant, { status: 201 });
  } catch (error) {
    console.error('POST /api/restaurants error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
