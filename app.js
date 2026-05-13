const apiUrl = 'http://localhost:3000/produtos';

function cadastrarProduto() {
    const produto = document.getElementById('nome').value;
    const sku = document.getElementById('sku').value;
    const categoria = document.getElementById('categoria').value;
    const quantidade = document.getElementById('quantidade').value;
    const fornecedor = document.getElementById('fornecedor').value;
    const unidade = document.querySelector('input[name="embalagem"]:checked')?.value;
    const descricao = document.getElementById('descricao').value;
    const imagem = document.getElementById('imagem').files[0];

    const dados = { id: Date.now(), produto, sku, categoria, quantidade, fornecedor, unidade, descricao };

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    }).then(resposta => {
        if (resposta.ok) {
            alert('Produto cadastrado!');
            exibeProdutos();
        } else {
            alert('Erro ao cadastrar produto!');
        }
    });
}

function limparInputs() {
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => input.value = "");
}

function exibeProdutos() {
    const tableProdutos = document.getElementById("table-produtos");

    tableProdutos.innerHTML = "";

    readProdutos(produtos => {
        for (let i = 0; i < produtos.length; i++) {
            let produto = produtos[i];
            tableProdutos.innerHTML += `
                <tr data-id="${produto.id}" onclick="selecionarLinha(this)">
                    <td>${produto.id}</td>
                    <td>${produto.produto}</td>
                    <td>${produto.sku}</td>
                    <td>${produto.categoria}</td>
                    <td>${produto.quantidade}</td>
                    <td>${produto.fornecedor}</td>
                    <td>${produto.unidade}</td>
                    <td>${produto.descricao}</td>
                </tr>`;
        }
    });
}

function selecionarLinha(linha) {
    document.querySelectorAll('#table-produtos tr').forEach(tr => tr.classList.remove('table-active'));
    linha.classList.add('table-active');
}

function excluirProduto() {
    const linhaSelecionada = document.querySelector('#table-produtos tr.table-active');

    if (!linhaSelecionada) {
        alert('Selecione um produto na tabela antes de apagar.');
        return;
    }

    const id = linhaSelecionada.dataset.id;

    fetch(`${apiUrl}/${id}`, { method: 'DELETE' }) 
        .then(resposta => {
            if (resposta.ok) {
                alert('Produto excluído!');
                exibeProdutos();
            } else {
                alert('Erro ao excluir produto!');
            }
        });
}

function readProdutos(processaDados) {
    fetch(apiUrl)
        .then(db => db.json())
        .then(data => {
            processaDados(data);
        })
        .catch(error => {
            console.error('Erro ao ler os produtos via API JSONServer:', error);
            displayMessage("Erro ao ler os produtos");
        });
}

exibeProdutos();

