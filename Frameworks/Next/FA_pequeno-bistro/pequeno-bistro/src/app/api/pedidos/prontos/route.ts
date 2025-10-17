// src/app/api/pedidos/prontos/route.ts
import { getPedidosProntos } from "../../../../controllers/PedidoController";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pedidosProntos = await getPedidosProntos();
    console.log('Pedidos prontos do banco:', pedidosProntos);
    
    return NextResponse.json({ 
      success: true, 
      data: pedidosProntos,
      count: pedidosProntos.length 
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos prontos:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}