import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

export async function getTodosPosts() {
    const db = conexao.db("imersao-instabuytes");
    const colecao = db.collection("posts");
    return colecao.find().toArray();
}

export async function criarPost(novoPosts) {
    const db = conexao.db("imersao-instabuytes");
    const colecao = db.collection("posts");
    return colecao.insertOne(novoPosts);
}

export async function atualizarPosts(id, novoPosts) {
    const db = conexao.db("imersao-instabuytes");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id);
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set: novoPosts});
}

export async function excluirPost(id) {
    const db = conexao.db("imersao-instabuytes");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id);
    return colecao.deleteOne({ _id: new ObjectId(objID) });
}