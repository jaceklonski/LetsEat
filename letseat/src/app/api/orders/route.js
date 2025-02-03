import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let token = authHeader.split(" ")[1];
    if (Array.isArray(token)) token = token.join(".");

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = decoded.id;
    const userRole = decoded.role;
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    let where = {};

    if (userRole === "USER") {
      where.userId = userId;
    }

    if (restaurantId) {
      where.restaurantId = restaurantId;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            dish: true,
          },
        },
        restaurant: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let token = authHeader.split(" ")[1];
    if (Array.isArray(token)) token = token.join(".");

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = decoded.id;

    let body;
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { restaurantId, items } = body;

    if (!restaurantId) {
      return NextResponse.json({ error: "restaurantId is required" }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const createdOrder = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: userId,
          restaurantId: restaurantId,
          status: "NEW",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            dishId: item.dishId, 
            quantity: item.quantity,
          },
        });
      }

      const completeOrder = await tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          items: { include: { dish: true } },
          restaurant: true,
          user: true,
        },
      });

      return completeOrder;
    });

    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
