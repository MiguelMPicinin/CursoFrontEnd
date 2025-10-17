'use client';

import { useEffect } from 'react';

export default function SessionHandler() {
  useEffect(() => {
    // Verificar se há dados inconsistentes
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    
    // Se tem um mas não tem o outro, limpa tudo
    if ((token && !usuario) || (!token && usuario)) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
  }, []);

  return null;
}