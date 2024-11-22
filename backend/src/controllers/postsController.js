import { getTodosPosts, criarPost, atualizarPosts, excluirPost } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

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

export async function atualizarNovoPosts(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;
    
    try {
        
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }
        const postCriado = await atualizarPosts(id, post);
        res.status(200).json(postCriado);
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro": "Falha na requisição"});
    }
}

export async function excluirPostController(req, res) {
    const id = req.params.id;

    try {
        // Remover a imagem do disco se existir
        const caminhoImagem = `uploads/${id}.png`;
        if (fs.existsSync(caminhoImagem)) {
            fs.unlinkSync(caminhoImagem);
        }

        const resultado = await excluirPost(id);
        if (resultado.deletedCount === 0) {
            res.status(404).json({ erro: "Post não encontrado" });
        } else {
            res.status(200).json({ mensagem: "Post excluído com sucesso" });
        }
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ erro: "Erro ao excluir post" });
    }
}