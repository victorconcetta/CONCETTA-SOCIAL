const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Configuração do CORS para aceitar seu site no GitHub Pages
app.use(cors({
    origin: '*', // Permite acessos de qualquer origem (ideal para teste)
    methods: ['GET', 'POST']
}));

app.use(bodyParser.json());

// Conexão com o banco usando a sua URL do Railway
const db = mysql.createConnection('mysql://root:eJkGdObsNeLvNVlKFWNSuKtcCPHSJKzU@switchback.proxy.rlwy.net:10186/railway');

db.connect((err) => {
    if (err) {
        console.error('❌ Erro no Banco:', err.message);
        return;
    }
    console.log('✅ Conectado ao MySQL do Railway!');
});

app.post('/cadastrar', (req, res) => {
    const { nome, text } = req.body;
    const sql = 'INSERT INTO recados (nome, text) VALUES (?, ?)';
    db.query(sql, [nome, text], (err) => {
        if (err) {
            console.error('Erro ao inserir:', err);
            return res.status(500).send('Erro no banco');
        }
        res.status(200).send('Recado enviado!');
    });
});

app.get('/api/mensagens', (req, res) => {
    const sql = 'SELECT * FROM recados ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar:', err);
            return res.status(500).send('Erro ao buscar');
        }
        res.json(results);
    });
});

// A porta deve ser process.env.PORT para o Railway funcionar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server rodando na porta ${PORT}`);
}); // <--- Aqui estava faltando fechar!