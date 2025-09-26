import { autenticaUsuario } from "@/controllers/usuarioController";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET){
    throw new Error("JWT_SECRET não esta definida nas váriaveis")
}

export async function POST(req: Request) {
    try {
        const {username, password} = await req.json();
        //validar os dados
        if(!username || !password){
            return NextResponse.json({success: false,error: "Usuario e Senha são obrigatorios"})
        }
        //importar o método de autenticação
        const usuario = await autenticaUsuario(username, password);
        if(!usuario){
            return NextResponse.json({success:false, error: "Usuário ou Senha Invalidos"})
        }
        //criar o token JWT
        const token = jwt.sign(
            {id: usuario._id, username: usuario.username, tipo: usuario.tipo},
            JWT_SECRET as string,
            { expiresIn: "8h"}
        );
        return NextResponse.json({success: true, token});
    } catch (error) {
        return NextResponse.json({success: false,error: error})
    }
}