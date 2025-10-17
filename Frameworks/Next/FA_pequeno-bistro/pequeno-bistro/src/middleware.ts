// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const usuarioCookieValue = request.cookies.get('usuario')?.value;
  const { pathname } = request.nextUrl;

  console.log('Middleware:', { 
    pathname, 
    hasToken: !!token,
    hasUsuario: !!usuarioCookieValue
  });

  // Rotas públicas - sempre permitir acesso
  if (pathname === '/login' || pathname === '/') {
    // Se já está logado e tenta acessar login, redireciona para página apropriada
    if (token && usuarioCookieValue && pathname === '/login') {
      try {
        const usuario = JSON.parse(usuarioCookieValue);
        let destino = '/';
        
        switch (usuario.tipo) {
          case 'gerente':
            destino = '/gerente';
            break;
          case 'garcom':
            destino = '/garcom';
            break;
          case 'cozinha':
            destino = '/cozinha';
            break;
          default:
            destino = '/';
        }
        
        console.log(`Redirecionando usuário ${usuario.tipo} para: ${destino}`);
        return NextResponse.redirect(new URL(destino, request.url));
      } catch (error) {
        // Cookie corrompido, permite acesso ao login
        console.log('Cookie de usuário corrompido, permitindo acesso ao login');
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Rotas protegidas - verificar autenticação
  if (!token || !usuarioCookieValue) {
    console.log('Sem token ou usuário, redirecionando para login');
    const response = NextResponse.redirect(new URL('/login', request.url));
    
    // Limpa cookies inválidos
    response.cookies.delete('token');
    response.cookies.delete('usuario');
    
    return response;
  }

  try {
    const usuario = JSON.parse(usuarioCookieValue);
    const rotaPermitida = `/${usuario.tipo}`;
    
    // Verificar se o usuário tem permissão para a rota atual
    if (!pathname.startsWith(rotaPermitida)) {
      console.log(`Usuário ${usuario.tipo} tentando acessar rota não permitida: ${pathname}`);
      return NextResponse.redirect(new URL(rotaPermitida, request.url));
    }

    console.log(`Acesso permitido para ${usuario.tipo} em ${pathname}`);
    return NextResponse.next();
    
  } catch (error) {
    // Cookie corrompido, redireciona para login
    console.log('Erro ao parsear cookie de usuário, redirecionando para login');
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    response.cookies.delete('usuario');
    return response;
  }
}

export const config = {
  matcher: [
    '/gerente/:path*',
    '/garcom/:path*', 
    '/cozinha/:path*',
    '/login',
  ],
};