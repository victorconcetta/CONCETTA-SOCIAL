async function enviardados() {
    const nome = document.getElementById('nome').value;
    const text = document.getElementById('text').value;

    if (!nome || !text) {
        alert("Por favor, preencha o nome e a mensagem!");
        return;
    }

    const dados = { nome, text };

    try {
        const resposta = await fetch('http://localhost:3000/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.text();
        alert(resultado);

        // Limpa os campos após enviar
        document.getElementById('nome').value = '';
        document.getElementById('text').value = '';

        // Atualiza a lista de recados automaticamente
        carregarMensagens();

    } catch (erro) {
        console.error('Erro ao enviar:', erro);
        alert('Erro ao conectar com o servidor.');
    }
}

async function carregarMensagens() {
    try {
        const resposta = await fetch('http://localhost:3000/api/mensagens');
        const mensagens = await resposta.json();

        const containerPrincipal = document.getElementById('receberecados');
        
        // Limpa o container para não acumular lixo
        containerPrincipal.innerHTML = '';

        mensagens.forEach(msg => {
            // Criamos a div do recado na hora
            const blocoRecado = document.createElement('div');
            
            // Adicionamos a classe que tem o seu estilo (borda, fundo azul, etc)
            blocoRecado.classList.add('recadinhos'); 

            // Injetamos o conteúdo com os dados que vieram do banco
            blocoRecado.innerHTML = `
                <p>De:</p>
                <div class="nome">${msg.nome}</div>
                <div class="textodorecado">${msg.text}</div>
            `;

            // Colocamos o novo recado dentro do container principal
            containerPrincipal.appendChild(blocoRecado);
        });
    } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
    }
}
document.addEventListener('DOMContentLoaded', carregarMensagens);