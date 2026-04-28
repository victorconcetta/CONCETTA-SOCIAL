const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();

// Configuração do CORS para aceitar seu site
app.use(cors());
app.use(bodyParser.json());

// Configuração do TiDB
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 4000,
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true 
    }
});

// --- ROTA PARA CADASTRAR RECADO ---
app.post('/cadastrar', (req, res) => {
    const { nome, text } = req.body;
    const query = 'INSERT INTO mensagens (nome, text) VALUES (?, ?)';
    
    db.query(query, [nome, text], (err, result) => {
        if (err) {
            console.error('Erro ao inserir:', err);
            return res.status(500).send('Erro ao salvar no banco');
        }
        res.send('Recado enviado com sucesso!');
    });
});

// --- ROTA PARA BUSCAR MENSAGENS ---
app.get('/api/mensagens', (req, res) => {
    const query = 'SELECT * FROM mensagens ORDER BY id DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar:', err);
            return res.status(500).send('Erro ao buscar mensagens');
        }
        res.json(results);
    });
});

// Verificação de conexão no log
db.getConnection((err, connection) => {
    if (err) console.error('❌ Erro no TiDB:', err.message);
    else {
        console.log('✅ Conectado ao TiDB!');
        connection.release();
    }
});

// PORTA DINÂMICA (O segredo do Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server rodando na porta ${PORT}`);
});