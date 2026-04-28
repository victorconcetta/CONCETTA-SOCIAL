const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: __dirname + '/.env' });
console.log("Testando Host do Banco:", process.env.DB_HOST);

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(bodyParser.json());

// Configuração atualizada para TiDB
const db = mysql.createPool({
    host: process.env.DB_HOST,      // Mudamos para bater com seu .env
    user: process.env.DB_USER,      // Mudamos para bater com seu .env
    password: process.env.DB_PASS,  // Mudamos para bater com seu .env
    database: process.env.DB_NAME,  // Mudamos para bater com seu .env
    port: process.env.DB_PORT || 4000,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // ESSA PARTE É O SEGREDO PRO TIDB:
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true 
    }
});

// Verificação de conexão
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Erro ao conectar no TiDB:', err.message);
    } else {
        console.log('✅ Conectado à Rede de Dados no TiDB!');
        connection.release();
    }
});
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server rodando na porta ${PORT}`);
    console.log(`Pode testar enviando dados para http://localhost:${PORT}/cadastrar`);
});