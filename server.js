// servidor do StreamFlix: api + arquivos estáticos
const path = require('path');
const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({ host: 'localhost', 
    port: 5433,
    user: 'postgres', 
    password: 'senai', 
    database: 'stream_flix' });

// capas salvas em imagens/capas, o nome vira a data/hora do envio
const upload = multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, 'imagens', 'capas'),
        filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname).toLowerCase()),
    }),
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));
['imagens', 'icons', 'fonts'].forEach(pasta => app.use('/' + pasta, express.static(path.join(__dirname, pasta))));

// lista os filmes com o admin que cadastrou, total de curtidas e se o usuário logado curtiu
app.get('/api/filmes', async (req, res) => {
    const { rows } = await pool.query(
        `SELECT f.id_filme, f.titulo_filme, f.genero, f.url_capa, f.id_usuario,
                u.nome_usuario AS admin,
                COUNT(c.id_curtida)::int AS curtidas,
                COALESCE(BOOL_OR(c.id_usuario = $1::int), false) AS curtido
         FROM tb_filme f
         JOIN tb_usuario u ON u.id_usuario = f.id_usuario
         LEFT JOIN tb_curtida c ON c.id_filme = f.id_filme
         GROUP BY f.id_filme, u.nome_usuario
         ORDER BY f.created_at DESC`,
        [req.query.id_usuario || null],
    );
    res.json(rows);
});

app.post('/api/login', async (req, res) => {
    const { nome_usuario, senha } = req.body;
    const { rows } = await pool.query(
        `SELECT id_usuario, nome, nome_usuario, email, imagem_usuario, tipo
         FROM tb_usuario WHERE nome_usuario = $1 AND senha = $2`,
        [nome_usuario, senha],
    );
    if (!rows.length) return res.status(401).json({ erro: 'Usuário ou senha incorretos' });
    res.json(rows[0]);
});

// curtir/descurtir: se já existe apaga, se não existe cria
app.post('/api/curtidas', async (req, res) => {
    const { id_usuario, id_filme } = req.body;
    const apagou = await pool.query('DELETE FROM tb_curtida WHERE id_usuario = $1 AND id_filme = $2', [id_usuario, id_filme]);
    if (!apagou.rowCount) {
        await pool.query('INSERT INTO tb_curtida (id_usuario, id_filme) VALUES ($1, $2)', [id_usuario, id_filme]);
    }
    res.json({ ok: true });
});

// total de filmes e de likes do admin
app.get('/api/perfil/:id', async (req, res) => {
    const { rows } = await pool.query(
        `SELECT COUNT(DISTINCT f.id_filme)::int AS filmes, COUNT(c.id_curtida)::int AS likes
         FROM tb_filme f
         LEFT JOIN tb_curtida c ON c.id_filme = f.id_filme
         WHERE f.id_usuario = $1`,
        [req.params.id],
    );
    res.json(rows[0]);
});

app.post('/api/filmes', upload.single('capa'), async (req, res) => {
    const { titulo_filme, genero, id_usuario } = req.body;
    await pool.query(
        'INSERT INTO tb_filme (titulo_filme, genero, url_capa, id_usuario) VALUES ($1, $2, $3, $4)',
        [titulo_filme, genero, 'imagens/capas/' + req.file.filename, id_usuario],
    );
    res.status(201).json({ ok: true });
});

// as curtidas somem junto (ON DELETE CASCADE no schema)
app.delete('/api/filmes/:id', async (req, res) => {
    await pool.query('DELETE FROM tb_filme WHERE id_filme = $1', [req.params.id]);
    res.json({ ok: true });
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));