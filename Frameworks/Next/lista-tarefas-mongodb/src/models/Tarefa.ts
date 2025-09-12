
//defiir a infraestrutura do obj

import mongoose,{ Document, Model, Schema } from "mongoose";

export interface Itarefa extends Document{
    //herdamos a base Documents do mongoose 
    //vamos criar os atributos do OBJ
    titulo:string;
    concluida:boolean;
    criadaEm:Date;
}

//vamos criar a Regra do Schema

const TarefaSchema: Schema<Itarefa> = new mongoose.Schema({
    titulo:{
        type:String,
        required:[true, "O titulo é Obrigatorio"],
        trim: true,
        maxLength: [50, "Máximo de 50 char"]
    },
    concluida:{
        type: Boolean,
        default: false
    },
    criadaEm:{
        type: Date,
        default: Date.now //pega o carimbo de data e hora
    }
});

const Tarefa: Model<Itarefa> = mongoose.models.Tarefa || mongoose.model<Itarefa>("Tarefa",TarefaSchema);

//componente reutilizavel
export default Tarefa;