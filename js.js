// ----------- HEAD --------------------------
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

// ----------- CRIANDO APP --------------------------
const app = express();

// Configuração do CORS para aceitar requisições de qualquer origem
app.use(cors());
app.use(bodyParser.json());

// ----------- CONECTAR SQL --------------------------
// Usando a sua string de conexão direta do Railway
const db = mysql.createConnection('mysql://root:eJkGdObsNeLvNVlKFWNSuKtcCPHSJKzU@switchback.proxy.rlwy.net:10186/railway');

db.connect((err) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco:', err.message);
        return;
    }
    console.log('✅ Conectado ao banco de dados MySQL do Railway!');
});

// ----------- ROTA: CADASTRAR NOVO RECADO --------------------------
app.post('/cadastrar', (req, res) => {
    const { nome, text } = req.body;
    
    // IMPORTANTE: Certifique-se que a tabela 'recados' foi criada no Railway
    const sql = 'INSERT INTO recados (nome, text) VALUES (?, ?)';
    
    db.query(sql, [nome, text], (err, result) => {
        if (err) {
            console.error('Erro no INSERT:', err);
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
            console.error('Erro no SELECT:', err);
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

// ----------- ROTA DE TESTE (Para ver se o server está vivo) -------
app.get('/', (req, res) => {
    res.send('Servidor da Rede Social rodando perfeitamente!');
});

// ----------- INICIAR SERVIDOR --------------------------
// O Railway exige que a porta seja dinâmica via process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});