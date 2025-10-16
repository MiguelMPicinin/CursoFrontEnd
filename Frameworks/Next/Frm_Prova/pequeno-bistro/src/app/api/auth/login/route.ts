import { autenticaUsuario } from "@/controllers/UsuarioController";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET){
    throw new Error("JWT_SECRET não está definida nas variáveis locais");
}

export async function POST(req: Request){
    try {
        const{username, password} = await req.json();
        
        if(!username || !password){
            return NextResponse.json({success:false, error: "Usuário e Senha são Obrigatórios"});
        }

        const usuario = await autenticaUsuario(username, password);
        if(!usuario){
            return NextResponse.json({success:false, error: "Usuário ou Senha inválidos"});
        }

        const token = jwt.sign(
            {id: usuario._id, username: usuario.username, tipo: usuario.tipo},
            JWT_SECRET as string,
            { expiresIn: "1h"}
        );

        return NextResponse.json({
            success: true, 
            token, 
            usuario: {
                id: usuario._id, 
                username: usuario.username, 
                tipo: usuario.tipo,
                nome: usuario.nome
            }});
    } catch (error) {
        return NextResponse.json({success:false, error: error}); 
    }
}