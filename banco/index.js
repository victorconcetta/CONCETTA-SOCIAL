const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Configuração do CORS
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST']
}));

app.use(bodyParser.json());

// Criando um Pool de conexões (mais estável para o Railway)
// As variáveis process.env são preenchidas automaticamente pelo Railway
const db = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// No Pool, verificamos a conexão assim:
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Erro ao conectar no MySQL:', err.message);
    } else {
        console.log('✅ Conectado ao MySQL do Railway!');
        connection.release(); // Libera a conexão de teste
    }
});

// Rota para cadastrar recado
app.post('/cadastrar', (req, res) => {
    const { nome, text } = req.body;
    
    if (!nome || !text) {
        return res.status(400).send('Nome e texto são obrigatórios');
    }

    const sql = 'INSERT INTO recados (nome, text) VALUES (?, ?)';
    db.query(sql, [nome, text], (err) => {
        if (err) {
            console.error('Erro ao inserir:', err);
            return res.status(500).send('Erro no banco de dados');
        }
        res.status(200).send('Recado enviado!');
    });
});

// Rota para buscar mensagens
app.get('/api/mensagens', (req, res) => {
    const sql = 'SELECT * FROM recados ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar:', err);
            return res.status(500).send('Erro ao buscar mensagens');
        }
        res.json(results);
    });
});

// A porta DEVE ser process.env.PORT. 
// O host '0.0.0.0' garante que o serviço seja exposto corretamente.
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server rodando na porta ${PORT}`);
});