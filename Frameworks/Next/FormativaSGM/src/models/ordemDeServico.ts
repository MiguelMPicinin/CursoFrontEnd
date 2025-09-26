//classe para equipamento

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrdemServico extends Document{
    _id:string;
    titulo:string;
    descricao:string;
    tipoManutencao: string;
    status: string;
    dataSolicitada: Date;
    dataFinalizada: Date | null;
    tecnicoId: string;
    equipamentoId: string;
}

const OrdemServicoSchema:Schema<IOrdemServico> = new Schema({
    titulo:{type:String, required: true},
    descricao:{type:String, required: true},
    tipoManutencao:{type:String,
        enum:["preventiva","emergencia","preditiva"],
        required:true},
    status: {type:String, 
            enum: ["ativo","inativo"],
            default: "ativo"},
    dataSolicitada:{type: Date, default: Date.now},
    dataFinalizada:{type: Date, default:null},
    tecnicoId: {type: String, required: true},
    equipamentoId: {type: String, required: true},

       
});

const OrdemServico: Model<IOrdemServico> = mongoose.models.Equipamento 
|| mongoose.model<IOrdemServico>("OrdemServico",OrdemServicoSchema);

export default OrdemServico;