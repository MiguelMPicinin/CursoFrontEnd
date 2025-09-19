import mongoose, { Schema } from "mongoose";

export interface OrdemDeServico{
    usuarioId: string;
    maquinaId: string;
    titulo: string;
    descricao: string;
    tipoManutencao: string;
    status: "Funcionando";

}

const OrdemSchema: Schema<OrdemDeServico> = new mongoose.Schema({
    usuarioId:{
        type: String,
        required:[true, "O id de usuario é necessario"],
        trim: true,
        maxLength: [50, "Máximo de 50 char"]
    },
    maquinaId:{
        type: String,
        required:[true, "O id da maquina é necessario"],
        trim: true,
        maxLength: [50, "Máximo de 50 char"]
    },
    titulo:{
        type: String,
        trim: true,
        maxLength: [100, "Máximo de 100 char"]
    },
    descricao:{
        type: String,
        trim: true,
        maxLength: [100, "Máximo de 100 char"],
    },
    tipoManutencao:{
        type: String,
        trim:true,
        maxLength:[100, "Tem que ter no maxiom 100 char"],
        required:[true, "O Funcionario tem que ter ua função"]
    },
   status:{
        type: String,
        enum: ["Funcionando", "Em Manutenção", "Quebrada"],
        required:[true, "è necessario a maquina ter um status"],
        default: "Funcionando"
   }
});

const OrdemDeServico: Model<OrdemDeServico> = mongoose.models.Tarefa || mongoose.model<OrdemDeServico>("Ordem de Servico", OrdemSchema);

export default OrdemDeServico;