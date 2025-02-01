import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = decoded.id;
    const userRole = decoded.role;

    const { search } = Object.fromEntries(request.nextUrl.searchParams.entries());

    let where = {};
    if (search && search.trim() !== "") {
      const lowercasedTerm = search.toLowerCase();
      where.OR = [
        {
          name: {
            contains: lowercasedTerm,
            mode: "insensitive",
          },
        },
        {
          cuisine: {
            contains: lowercasedTerm,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: lowercasedTerm,
            mode: "insensitive",
          },
        },
      ];
    }

    if (userRole === "RESTAURANT") {
      where.userId = userId;
    } else if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        dishes: true,
      },
    });

    return NextResponse.json(restaurants, { status: 200 });
  } catch (error) {
    console.error("GET /api/restaurants error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, address, cuisine, email, password } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const result = await prisma.$transaction(async (prisma) => {
      const newUser = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: 'RESTAURANT',
        },
      });

      const newRestaurant = await prisma.restaurant.create({
        data: {
          name,
          address,
          cuisine,
          owner: {
            connect: { id: newUser.id },
          },
        },
      });

      return { newUser, newRestaurant };
    });

    return NextResponse.json(result.newRestaurant, { status: 201 });
  } catch (error) {
    console.error('POST /api/restaurants error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
