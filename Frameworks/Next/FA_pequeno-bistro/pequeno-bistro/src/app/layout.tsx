// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SessionHandler from '../lib/SessionHandler'; // Ajuste o caminho conforme necessário

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pequeno Bistrô Sabor Local',
  description: 'Sistema de gestão de pedidos para restaurantes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SessionHandler />
        {children}
      </body>
    </html>
  );
}