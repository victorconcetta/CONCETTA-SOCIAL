// ----------- HEAD --------------------------
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

// ----------- CRIANDO APP --------------------------
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ----------- CONECTAR SQL --------------------------
const db = mysql.createConnection({
    host: 'switchback.proxy.rlwy.net',
    user: 'root',
    password: 'eJkGdObsNeLvNVlKFWNSuKtcCPHSJKzU', 
    database: 'railway',
    port: 10186,
    ssl: {
        rejectUnauthorized: false
    },
    connectTimeout: 10000
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

// ----------- ROTA: CADASTRAR NOVO RECADO --------------------------
app.post('/cadastrar', (req, res) => {
    const { nome, text } = req.body;
    // Certifique-se que a tabela se chama 'recados'
    const sql = 'INSERT INTO recados (nome, text) VALUES (?, ?)';
    
    db.query(sql, [nome, text], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao salvar no banco');
        } else {
            res.status(200).send('Recado enviado com sucesso!');
        }
    });
});

// ----------- ROTA: BUSCAR TODOS OS RECADOS (A que faltava!) ----------------
// Essa rota é a que o seu front-end chama no fetch('.../api/mensagens')
app.get('/api/mensagens', (req, res) => {
    const sql = 'SELECT * FROM recados ORDER BY id DESC'; // Mostra os mais recentes primeiro
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao buscar mensagens');
        } else {
            res.json(results); // Envia o array de objetos para o front
        }
    });
});

// ----------- ROTA: BUSCAR POR NOME (Opcional) ------------------------------
app.get('/buscar/:nome', (req, res) => {
    const nome = req.params.nome;
    const sql = 'SELECT * FROM recados WHERE nome LIKE ?';
    
    db.query(sql, [`%${nome}%`], (err, results) => {
        if (err) {
            res.status(500).send('Erro no servidor');
        } else {
            res.json(results);
        }
    });
});

// ----------- INICIAR SERVIDOR --------------------------
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});