import { createItemCardapio, getItensCardapio } from "../../../controllers/CardapioController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
  try {
    const data = await getItensCardapio();
    return NextResponse.json({success:true, data:data});
  } catch (error) {
    console.error('Erro GET /api/cardapio:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar itens do cardápio' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newItem = await createItemCardapio(data);
    return NextResponse.json({success:true, data: newItem}, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    console.error('Erro POST /api/cardapio:', error);
    const status = errorMessage.includes('obrigatório') || errorMessage.includes('tamanho') ? 400 : 500;
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status }
    );
  }
}