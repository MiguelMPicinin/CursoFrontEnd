//rotas que não precisam especificar o ID (ou seja Get e Post)

import { createTarefa, getAllTarefas } from "@/controllers/tarefaController";
import { NextRequest, NextResponse } from "next/server";

//Get
export async function GET() {
    try {
        const tarefas = await getAllTarefas();
        return NextResponse.json({success:true, data:tarefas}, {status:200});
    } catch (error) {
        return NextResponse.json({
            success:false,
            error: `Falha ao buscar as Tarefas: ${error}`
        },{status:500});
    }
}
//Post
export async function POST(req:NextRequest) {
    try {
        const data = await req.json(); // verifico se esta escrito no formato JSON
        const newTarefa = await createTarefa(data);
        return NextResponse.json({success:true, data:newTarefa}, {status:201});
    } catch (error) {
        return NextResponse.json({
            success:false,
            error: `Falha ao inserir as Tarefas: ${error}`
        },{status:500});
    }
}