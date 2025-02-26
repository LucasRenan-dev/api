// Função para extrair o tipo e o ID da URL
function getTypeAndIdFromUrl() {
    const hash = window.location.hash; // Exemplo: "#/langs/123"
    const [_, type, id] = hash.split('/'); // Divide a URL em partes
    return { type, id };
}

// Função para buscar os detalhes do item selecionado
async function fetchItemDetails(type, id) {
    const response = await fetch(`http://127.0.0.1:5000/${type}/${id}`);
    const responsedata = await response.json()
    if (response.ok) {
        return responsedata;
    }
    throw new Error('Erro ao buscar os detalhes do item.');
}

// Função para renderizar os dados na página
function renderItemDetails(data) {
    const container = document.querySelector('.info-container');

    // Nome (centralizado)
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = data.name || 'Nome não disponível';
    container.appendChild(name);

    // Creation (logo abaixo do nome)
    const creation = document.createElement('div');
    creation.className = 'creation';
    creation.textContent = `Criado em: ${data.creation || 'Data não disponível'}`;
    container.appendChild(creation);

    // Descrição (logo abaixo do creation)
    const description = document.createElement('div');
    description.className = 'description';
    description.textContent = data.description || 'Descrição não disponível';
    container.appendChild(description);

    // Tutorial (direita, em cima)
    const tutorial = document.createElement('div');
    tutorial.className = 'info-block tutorial';
    tutorial.innerHTML = `<h3>Tutorial</h3><p><a href="${data.tutorial || '#'}" target="_blank">Acessar Tutorial</a></p>`;
    container.appendChild(tutorial);

    // Download (direita, em baixo do tutorial)
    const download = document.createElement('div');
    download.className = 'info-block download';
    download.innerHTML = `<h3>Download</h3><p><a href="${data.download || '#'}" target="_blank">Baixar Agora</a></p>`;
    container.appendChild(download);

    // Typing (esquerda, em cima)
    const typing = document.createElement('div');
    typing.className = 'info-block typing';
    typing.innerHTML = `<h3>Typing</h3><p>${data.typing || 'Tipo não disponível'}</p>`;
    container.appendChild(typing);

    // Docs (esquerda, em baixo do typing)
    const docs = document.createElement('div');
    docs.className = 'info-block docs';
    docs.innerHTML = `<h3>Documentação</h3><p><a href="${data.docs || '#'}" target="_blank">Acessar Documentação</a></p>`;
    container.appendChild(docs);
}

// Função principal
async function main() {
    try {
        const { type, id } = getTypeAndIdFromUrl(); // Obtém o tipo e o ID da URL
        const itemDetails = await fetchItemDetails(type, id); // Busca os detalhes do item
        renderItemDetails(itemDetails); // Renderiza os detalhes na página
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar os detalhes. Tente novamente.');
    }
}

// Executa a função principal
main();