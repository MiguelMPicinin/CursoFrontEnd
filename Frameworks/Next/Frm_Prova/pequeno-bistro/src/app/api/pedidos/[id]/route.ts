import { deletePedido, getPedidoById, updateStatusPedido, fecharContaPedido } from "@/controllers/PedidoController";
import { NextRequest, NextResponse } from "next/server";

interface Parametro{
    id:string;
}

export async function PATCH(req: NextRequest, {params}:{params:Parametro}){
    try {
        const {id} = params;
        const data = await req.json();
        
        if (data.status) {
            const pedidoAtualizado = await updateStatusPedido(id, data.status);
            if(!pedidoAtualizado){
                return NextResponse.json({success:false, error: "Not Found"});
            }
            return NextResponse.json({success:true, data:pedidoAtualizado});
        } else if (data.acao === 'fechar-conta') {
            const pedidoFechado = await fecharContaPedido(id);
            if(!pedidoFechado){
                return NextResponse.json({success:false, error: "Not Found"});
            }
            return NextResponse.json({success:true, data:pedidoFechado});
        } else {
            return NextResponse.json({success:false, error: "Ação inválida"});
        }
    } catch (error) {
        return NextResponse.json({success:false, error:error});
    }
}

export async function GET ({params}:{params:Parametro}){
    try {
        const {id} = params;
        const data = await getPedidoById(id);
        if(!data){
            return NextResponse.json({success:false, error: "Not Found"});
        }
        return NextResponse.json({success:true, data:data});
    } catch (error) {
        return NextResponse.json({success:false, error:error});
    }
}

export async function DELETE({params}:{params:Parametro}) {
    try {
        const {id} = params;
        await deletePedido(id);
        return NextResponse.json({success: true, data:{}});
    } catch (error) {
        return NextResponse.json({success:false, error:error});        
    }
}