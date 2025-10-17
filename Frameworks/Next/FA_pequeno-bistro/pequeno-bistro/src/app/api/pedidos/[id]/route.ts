import { deletePedido, getPedidoById, updateStatusPedido, fecharContaPedido } from "../../../../controllers/PedidoController";
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
    let pedidoAtualizado = null;
    
    if (data.status) {
      pedidoAtualizado = await updateStatusPedido(id, data.status);
    } else if (data.acao === 'fechar-conta') {
      pedidoAtualizado = await fecharContaPedido(id);
    } else {
      return NextResponse.json({success:false, error: "Ação de PATCH inválida"}, { status: 400 });
    }

    if (!pedidoAtualizado) {
      return NextResponse.json({success:false, error: "Pedido não encontrado"}, { status: 404 });
    }
    
    return NextResponse.json({success:true, data:pedidoAtualizado});
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    console.error('Erro PATCH /api/pedidos/[id]:', error);
    const status = errorMessage.includes('inválido') ? 400 : 500;
    
    return NextResponse.json({success:false, error: errorMessage}, { status });
  }
}

export async function GET ({ params }: RouteParams){
  try {
    const { id } = params;
    const data = await getPedidoById(id);
    
    if (!data) {
      return NextResponse.json({success:false, error: "Pedido não encontrado"}, { status: 404 }); // 404 Not Found
    }
    
    return NextResponse.json({success:true, data:data});
  } catch (error) {
    console.error('Erro GET /api/pedidos/[id]:', error);
    return NextResponse.json({success:false, error: 'Erro ao buscar pedido'}, { status: 500 });
  }
}

export async function DELETE({ params }: RouteParams) {
  try {
    const { id } = params;
    const result = await deletePedido(id);
    
    if (!result.success) {
      // O controller retorna { success: false } se o ID não for encontrado
      return NextResponse.json({success: false, error: "Pedido não encontrado"}, { status: 404 });
    }

    return NextResponse.json({success: true, data: {}}, { status: 204 }); // 204 No Content para deleção bem-sucedida
  } catch (error) {
    console.error('Erro DELETE /api/pedidos/[id]:', error);
    return NextResponse.json({success:false, error: 'Erro ao deletar pedido'}, { status: 500 });       
  }
}