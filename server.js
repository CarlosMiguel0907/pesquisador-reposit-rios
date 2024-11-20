const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const GITHUB_API_URL = 'https://api.github.com/search/repositories';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Coloque seu token no arquivo .env

app.get('/search', async (req, res) => {
    const { keyword } = req.query;

    if (!keyword) {
        return res.status(400).json({ error: 'Palavra-chave é necessária' });
    }

    try {
        const response = await axios.get(GITHUB_API_URL, {
            headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
            params: {
                q: keyword,
                sort: 'stars',
                order: 'desc',
            },
        });

        const repositories = response.data.items.map(repo => ({
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            url: repo.html_url,
        }));

        res.json(repositories);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Erro ao buscar repositórios no GitHub' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
