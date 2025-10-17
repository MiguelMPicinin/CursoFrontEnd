import { NextResponse } from 'next/server';
import { autenticaUsuario } from '@/lib/auth';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não está definida nas variáveis de ambiente');
    }

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Usuário e senha são obrigatórios' },
        { status: 400 } // Bad Request
      );
    }

    const usuario = await autenticaUsuario(username, password);

    if (!usuario) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 } // Unauthorized
      );
    }

    // Criar token JWT
    const token = jwt.sign(
      { 
        userId: usuario._id, 
        username: usuario.username,
        tipo: usuario.tipo 
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Preparar resposta (removendo senha, claro)
    const usuarioPayload = {
      id: usuario._id.toString(),
      username: usuario.username,
      nome: usuario.nome,
      tipo: usuario.tipo
    };

    const response = NextResponse.json({
      success: true,
      usuario: usuarioPayload,
      token
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 8 * 60 * 60 // 8 horas
    };

    // Configurar cookies
    response.cookies.set('token', token, cookieOptions);
    response.cookies.set('usuario', JSON.stringify(usuarioPayload), { ...cookieOptions, httpOnly: false }); // 'usuario' pode ser acessível via JS

    return response;

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 } // Internal Server Error
    );
  }
}