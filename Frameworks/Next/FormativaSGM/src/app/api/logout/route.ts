// rota para o logout

import { NextResponse } from "next/server";

export async function POST() {
    // remove o token do lado do cliente
    return new NextResponse(JSON.stringify(
        {status: 204, message: "logout realizado com sucesso"}
    ));
}