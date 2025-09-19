import { Schema } from "inspector/promises";
import mongoose from "mongoose";

export interface Equipamento{
    nome:string;
    modelo: string;
    numeroSerie:string;
    localizacao: string;
    status: string;
}

const EquipamentoSchema: Schema<Equipamento> = new mongoose.Schema({
    nome:{
        type: String;
        
    }
})