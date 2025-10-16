import { deleteItemCardapio, getItemCardapioById, updateItemCardapio } from "@/controllers/CardapioController";
import { NextRequest, NextResponse } from "next/server";

interface Parametro{
    id:string;
}

export async function PATCH(req: NextRequest, {params}:{params:Parametro}){
    try {
        const {id} = params;
        const data = await req.json();
        const itemAtualizado = await updateItemCardapio(id, data);
        if(!itemAtualizado){
            return NextResponse.json({success:false, error: "Not Found"});
        }
        return NextResponse.json({success:true, data:itemAtualizado});
    } catch (error) {
        return NextResponse.json({success:false, error:error});
    }
}

export async function GET ({params}:{params:Parametro}){
    try {
        const {id} = params;
        const data = await getItemCardapioById(id);
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
        await deleteItemCardapio(id);
        return NextResponse.json({success: true, data:{}});
    } catch (error) {
        return NextResponse.json({success:false, error:error});        
    }
}