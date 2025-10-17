import { createItemCardapio, getItensCardapio } from "@/controllers/CardapioController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        const data = await getItensCardapio();
        return NextResponse.json({success:true, data:data});
    } catch (error) {
        return NextResponse.json({success:false, error:error})
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newItem = await createItemCardapio(data);
        return NextResponse.json({success:true, data: newItem});
    } catch (error) {
        return NextResponse.json({success:false, error:error})
    }
}