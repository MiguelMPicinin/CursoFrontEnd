// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logout realizado com sucesso' 
    });
    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
      maxAge: 0 // Expira imediatamente
    };

    // Limpar cookies
    response.cookies.set('token', '', cookieOptions);
    response.cookies.set('usuario', '', { 
      ...cookieOptions, 
      httpOnly: false 
    });

    return response;
  } catch (error) {
    console.error('Erro no logout:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}