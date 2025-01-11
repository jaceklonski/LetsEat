import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Szukamy użytkownika w bazie
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Porównujemy hasło z zahashowanym passwordHash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Hasło się zgadza – można zalogować
    // Na tym etapie można np. ustawić sesję, wygenerować JWT itp.

    // Dla bezpieczeństwa nie zwracamy passwordHash
    const { passwordHash, ...userData } = user;

    // W tym przykładzie zwrócimy tylko informacje o użytkowniku (bez tokenu)
    return NextResponse.json({
      message: 'Logged in successfully',
      user: userData,
    }, { status: 200 });
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
