import { getPedidosCozinha } from "@/controllers/PedidoController";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const data = await getPedidosCozinha();
        return NextResponse.json({success:true, data:data});
    } catch (error) {
        return NextResponse.json({success:false, error:error})
    }
}