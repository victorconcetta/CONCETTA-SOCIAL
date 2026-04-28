// O seu link oficial do Render!
const API_URL = 'https://concetta-social.onrender.com'; 

async function enviardados() {
    const nome = document.getElementById('nome').value;
    const text = document.getElementById('text').value;

    if (!nome || !text) {
        alert("Por favor, preencha o nome e a mensagem!");
        return;
    }

    const dados = { nome, text };

    try {
        // Envia para o servidor do Render
        const resposta = await fetch(`${API_URL}/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.text();
        alert(resultado);

        // Limpa os campos
        document.getElementById('nome').value = '';
        document.getElementById('text').value = '';

        // Atualiza a lista automaticamente
        carregarMensagens();

    } catch (erro) {
        console.error('Erro ao enviar:', erro);
        alert('Erro ao conectar com o servidor do Render.');
    }
}

async function carregarMensagens() {
    try {
        // Busca mensagens do servidor do Render
        const resposta = await fetch(`${API_URL}/api/recados`);
        
        if (!resposta.ok) throw new Error('Erro na resposta do servidor');
        
        const mensagens = await resposta.json();
        const containerPrincipal = document.getElementById('receberecados');
        
        containerPrincipal.innerHTML = '';

        mensagens.forEach(msg => {
            const blocoRecado = document.createElement('div');
            blocoRecado.classList.add('recadinhos'); 

            blocoRecado.innerHTML = `
                <p>De:</p>
                <div class="nome">${msg.nome}</div>
                <div class="textodorecado">${msg.text}</div>
            `;

            containerPrincipal.appendChild(blocoRecado);
        });
    } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
    }
}

// Carrega as mensagens assim que a página abrir
document.addEventListener('DOMContentLoaded', carregarMensagens);