JavaScript
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
// Usando process.env para ler as configurações do Railway de forma segura
const db = mysql.createConnection({
    host: process.env.MYSQLHOST || 'switchback.proxy.rlwy.net',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || 'eJkGdObsNeLvNVlKFWNSuKtcCPHSJKzU', 
    database: process.env.MYSQLDATABASE || 'railway',
    port: process.env.MYSQLPORT || 10186,
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

// ----------- ROTA: BUSCAR TODOS OS RECADOS ----------------
app.get('/api/mensagens', (req, res) => {
    const sql = 'SELECT * FROM recados ORDER BY id DESC';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao buscar mensagens');
        } else {
            res.json(results);
        }
    });
});

// ----------- ROTA: BUSCAR POR NOME ------------------------------
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
// Importante: Railway define a porta automaticamente através de process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});