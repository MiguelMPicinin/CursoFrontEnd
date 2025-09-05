//basear o meu modelo no schema da Coluna
import mongoose from "mongoose"

const TarefaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, "O Título é obrigadório"],
        trim: true,
        maxlenght: [100, "O título < 100 char"]
    },
    concluida: {
        type: Boolean,
        default: false, //toda a tarefa criada não esta concluida
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.models.Tarefa || mongoose.model("Tarefa", TarefaSchema)
//exporta o modelo como tarefa caso não exista uma tarefa no banco
//caso já exista uma tarefa.