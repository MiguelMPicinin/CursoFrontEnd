import { deleteItemCardapio, getItemCardapioById, updateItemCardapio } from "../../../../controllers/CardapioController";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const data = await req.json();
    const itemAtualizado = await updateItemCardapio(id, data);
    
    if (!itemAtualizado) {
      return NextResponse.json({success:false, error: "Item do cardápio não encontrado"}, { status: 404 });
    }
    
    return NextResponse.json({success:true, data:itemAtualizado});
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    console.error('Erro PATCH /api/cardapio/[id]:', error);
    const status = errorMessage.includes('obrigatório') || errorMessage.includes('tamanho') ? 400 : 500;
    
    return NextResponse.json({success:false, error: errorMessage}, { status });
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const data = await getItemCardapioById(id);
    
    if (!data) {
      return NextResponse.json({success:false, error: "Item do cardápio não encontrado"}, { status: 404 });
    }
    
    return NextResponse.json({success:true, data:data});
  } catch (error) {
    console.error('Erro GET /api/cardapio/[id]:', error);
    return NextResponse.json({success:false, error: 'Erro ao buscar item do cardápio'}, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const result = await deleteItemCardapio(id);

    if (!result.success) {
      return NextResponse.json({success: false, error: "Item do cardápio não encontrado"}, { status: 404 });
    }
    
    return new NextResponse(null, { status: 204 }); // 204 No Content - sem corpo
  } catch (error) {
    console.error('Erro DELETE /api/cardapio/[id]:', error);
    return NextResponse.json({success:false, error: 'Erro ao deletar item do cardápio'}, { status: 500 });       
  }
}