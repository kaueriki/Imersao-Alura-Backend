import { getTodosPosts, criarPost } from "../models/postsModel.js";
import fs from "fs";

export async function listarPosts(req, res) {
        const posts = await getTodosPosts();
        res.status(200).json(posts);
}

export async function cadastrarPosts(req, res) {
    const novoPosts = req.body;
    try {
        const postCriado = await criarPost(novoPosts);
        res.status(200).json(postCriado);
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro": "Falha na requisição"});
    }
}

export async function uploadImagem(req, res) {
    const novoPosts = req.body;
    try {
        const postCriado = await criarPost(novoPosts);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        fs.renameSync(req.file.path, imagemAtualizada)
        res.status(200).json(postCriado);
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro": "Falha na requisição"});
    }
}