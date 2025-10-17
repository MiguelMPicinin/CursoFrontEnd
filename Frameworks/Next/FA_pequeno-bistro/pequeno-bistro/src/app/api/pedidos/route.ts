import { createPedido, getPedidos } from "../../../controllers/PedidoController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
  try {
    const data = await getPedidos();
    return NextResponse.json({success:true, data:data});
  } catch (error) {
    console.error('Erro GET /api/pedidos:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar pedidos' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newPedido = await createPedido(data);
    return NextResponse.json({success:true, data: newPedido}, { status: 201 }); // 201 Created
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    console.error('Erro POST /api/pedidos:', error);
    
    // Erro de validação/negócio (400) ou Erro interno (500)
    const status = errorMessage.includes('inválido') || errorMessage.includes('obrigatório') || errorMessage.includes('encontrado') ? 400 : 500;

    return NextResponse.json(
      { success: false, error: errorMessage }, 
      { status }
    );
  }
}