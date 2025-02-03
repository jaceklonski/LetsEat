// app/api/orders/[orderId]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function PUT(request, { params }) {
  const { orderId } = params;

  // Walidacja tokena
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

  // Parsowanie body
  const body = await request.json();
  const { status } = body;

  try {
    // Zaktualizuj zamówienie w bazie (dostosuj logikę wedle potrzeb)
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId, 10) },
      data: {
        status: status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("PUT /api/orders/[orderId] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
