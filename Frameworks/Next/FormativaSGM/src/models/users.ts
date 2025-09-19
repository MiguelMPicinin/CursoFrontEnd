import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

import { Document as MongooseDocument } from "mongoose";

export interface IUsuario extends MongooseDocument {
    _id: string;
    email: string;
    senha?: string; // a senha não é retornada
    comparaSenha(userSenha: string): Promise<boolean>;
}

const UsuarioSchema: Schema<IUsuario> = new mongoose.Schema({
    email:{
        type: String,
        required:[true, "O Email é obrigatorio"],
        trim: true,
        unique: true,
        maxLength: [100, "Máximo de 100 char"]
    },
    senha:{
        type: String,
        required:[true, "A Senha é obrigatoria"],
        trim: true,
        select: false,
        maxLength: [100, "Máximo de 100 char"],
        minLength:[6, "A senha tem que ter mais que 6 char"]
    },
});

//middleware para Ocultar a senha
UsuarioSchema.pre<IUsuario>('save', async function (next) {
    if(!this.isModified('senha') || !this.senha) return next
    try{
        const salt = await bcrypt.genSalt(10);
        this.senha = await bcrypt.hash(this.senha, salt);
        next()
    } catch (error:any){
        next(error);
    }
})

// método para comparar senha
UsuarioSchema.methods.comparaSenha = function (userSenha:string): Promise<boolean>{
    return bcrypt.compare(userSenha, this.senha);
}



const Usuario: Model<IUsuario> = mongoose.models.Usuario || mongoose.model<Usuario>("Usuario", UsuarioSchema);

export default Usuario;