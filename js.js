// AQUI: Troque pelo link que o Railway te deu (Public Networking)
const API_URL = 'https://LINK_DO_SEU_APP_AQUI.up.railway.app'; 

async function enviardados() {
    const nome = document.getElementById('nome').value;
    const text = document.getElementById('text').value;

    if (!nome || !text) {
        alert("Preencha tudo!");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/cadastrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, text })
        });
        const resultado = await resposta.text();
        alert(resultado);
        
        document.getElementById('nome').value = '';
        document.getElementById('text').value = '';
        carregarMensagens();
    } catch (erro) {
        console.error('Erro:', erro);
    }
}

async function carregarMensagens() {
    try {
        const resposta = await fetch(`${API_URL}/api/mensagens`);
        const mensagens = await resposta.json();
        const container = document.getElementById('receberecados');
        container.innerHTML = '';

        mensagens.forEach(msg => {
            const bloco = document.createElement('div');
            bloco.classList.add('recadinhos'); 
            bloco.innerHTML = `
                <p>De:</p>
                <div class="nome">${msg.nome}</div>
                <div class="textodorecado">${msg.text}</div>
            `;
            container.appendChild(bloco);
        });
    } catch (erro) {
        console.error("Erro ao buscar:", erro);
    }
}

document.addEventListener('DOMContentLoaded', carregarMensagens);