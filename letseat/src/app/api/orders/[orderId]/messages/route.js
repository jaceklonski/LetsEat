import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic"; // pozwala używać params synchronicznie

export async function GET(request, { params }) {
  const { orderId } = params;

  // Autoryzacja (przykładowo)
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let token = authHeader.split(" ")[1];
  if (Array.isArray(token)) token = token.join(".");
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  try {
    const messages = await prisma.orderMessage.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("GET /api/orders/[orderId]/messages error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { orderId } = params;

  // Autoryzacja
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

  // Odczytanie JSON z body
  let body;
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { content } = body;
  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "Missing or invalid content" }, { status: 400 });
  }

  try {
    // Sprawdzenie, czy zamówienie istnieje
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Jeśli w body przekazano pole "role", używamy go. W przeciwnym razie domyślnie "USER".
    const role = body.role ? body.role : "USER";

    // Tworzenie wiadomości – senderId pobieramy z tokena, a senderRole ustawiamy na wartość z role
    const newMessage = await prisma.orderMessage.create({
      data: {
        orderId,
        senderId: decoded.id,
        senderRole: role,
        content,
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders/[orderId]/messages error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
