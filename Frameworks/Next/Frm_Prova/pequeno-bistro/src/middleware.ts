import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Rotas que requerem autenticação
  const rotasProtegidas = ['/gerente', '/garcom', '/cozinha'];
  const isRotaProtegida = rotasProtegidas.some(rota => pathname.startsWith(rota));
  
  // Se tentar acessar rota protegida sem token, redirecionar para login
  if (isRotaProtegida && !token) {
    const urlLogin = new URL('/login', request.url);
    return NextResponse.redirect(urlLogin);
  }

  // Se já estiver logado e tentar acessar login, redirecionar para página apropriada
  if (pathname === '/login' && token) {
    try {
      // Tentar obter informações do usuário do token
      const usuarioSalvo = request.cookies.get('usuario')?.value;
      if (usuarioSalvo) {
        const usuario = JSON.parse(usuarioSalvo);
        let rotaDestino = '/';
        
        switch (usuario.tipo) {
          case 'gerente':
            rotaDestino = '/gerente';
            break;
          case 'garcom':
            rotaDestino = '/garcom';
            break;
          case 'cozinha':
            rotaDestino = '/cozinha';
            break;
        }
        
        return NextResponse.redirect(new URL(rotaDestino, request.url));
      }
    } catch {
      // Em caso de erro, redirecionar para página inicial
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/gerente/:path*',
    '/garcom/:path*', 
    '/cozinha/:path*',
    '/login'
  ],
};