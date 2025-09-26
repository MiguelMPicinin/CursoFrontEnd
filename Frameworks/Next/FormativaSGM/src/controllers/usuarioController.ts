import connectMongo from "@/services/mongoDB";
import Usuario, { IUsuario } from "../models/users";

//listar todos os usuarios
export const getUsuarios = async () => {
  await connectMongo(); //estabelece conexão
  const usuarios = await Usuario.find({}); //lista todos os usuarios da conexão
  return usuarios; // retorna resultado da busca
};

//listar um usuario
export const getUsuarioById = async (id: string) => {
  await connectMongo();
  const usuario = await Usuario.findById(id);
  return usuario;
};

//criar um usuario
export const createUsuario = async (data: Partial<IUsuario>) => {
  await connectMongo();
  const novoUsuario = new Usuario(data);
  const novoUsuarioId = novoUsuario.save();
  return novoUsuarioId;
};

//atualizar dados do usuario
export const updateUsuario = async (id: string, data: Partial<IUsuario>) => {
  await connectMongo();
  const usuario = await Usuario.findByIdAndUpdate(id, data, { new: true });
  return usuario;
};

//deletar usuario
export const deleteUsuario = async (id: string) => {
  await connectMongo();
  await Usuario.findByIdAndDelete(id);
};

//métodos de autenticacao de usuario
export const autenticaUsuario = async (username: string, password: string) => {
    await connectMongo();
    // busca o usuario pelo username e a senha ainda crypto
    const usuario = await Usuario.find({username}).select("+password");
    
    //retorna se o usuario não foi encontrado
    if(!usuario || usuario.length === 0)return null;
    //comparar a senha digitada com a senha do banco
    const senhaSecreta = await usuario[0].comparePassword(password);
    if(!senhaSecreta) return null;
    //se deu certo retorna o usuario
    return usuario[0];
}