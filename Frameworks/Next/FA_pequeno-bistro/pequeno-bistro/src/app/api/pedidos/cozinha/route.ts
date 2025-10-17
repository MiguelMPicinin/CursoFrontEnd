import { getPedidosCozinha } from "../../../../controllers/PedidoController";
import { NextResponse } from "next/server";

export async function GET(){
  try {
    const data = await getPedidosCozinha();
    return NextResponse.json({success:true, data:data});
  } catch (error) {
    console.error('Erro GET /api/pedidos/cozinha:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar pedidos para cozinha' },
      { status: 500 }
    );
  }
}