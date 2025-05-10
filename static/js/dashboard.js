document.addEventListener('DOMContentLoaded', async () => {
    // Elementos DOM
    const typeSelect = document.getElementById('requestType');
    const optionSelect = document.getElementById('requestOption');
    const fetchBtn = document.getElementById('fetchBtn');
    const backBtn = document.getElementById('backBtn');
    const detailsContainer = document.getElementById('details-container');
    
    // Variáveis de estado
    let currentList = [];
    let currentView = 'list'; // 'list' ou 'details'
    
    // Carrega opções quando o tipo muda
    typeSelect.addEventListener('change', loadOptions);
    
    // Botão de busca
    fetchBtn.addEventListener('click', showDetails);
    
    // Botão de voltar
    backBtn.addEventListener('click', () => {
        detailsContainer.innerHTML = '';
        backBtn.style.display = 'none';
        fetchBtn.style.display = 'inline-block';
        currentView = 'list';
    });
    
    // Carrega as opções da API
    async function loadOptions() {
        const type = typeSelect.value;
        try {
            const response = await fetch(`http://127.0.0.1:5000/${type}`);
            if (!response.ok) throw new Error('Erro ao carregar opções');
            
            currentList = await response.json();
            updateOptions();
        } catch (error) {
            console.error('Erro:', error);
            detailsContainer.innerHTML = `<p class="error">${error.message}</p>`;
        }
    }
    
    // Atualiza o dropdown de opções
    function updateOptions() {
        optionSelect.innerHTML = '';
        currentList.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            optionSelect.appendChild(option);
        });
    }
    
    // Mostra os detalhes do item selecionado
    async function showDetails() {
        const type = typeSelect.value;
        const id = optionSelect.value;
        
        if (!id) {
            alert('Por favor, selecione um item');
            return;
        }
        
        try {
            const response = await fetch(`http://127.0.0.1:5000/${type}/${id}`);
            if (!response.ok) throw new Error('Item não encontrado');
            
            const data = await response.json();
            renderDetails(data);
            
            // Atualiza a UI
            fetchBtn.style.display = 'none';
            backBtn.style.display = 'inline-block';
            currentView = 'details';
        } catch (error) {
            console.error('Erro:', error);
            detailsContainer.innerHTML = `<p class="error">${error.message}</p>`;
        }
    }
    
    // Renderiza os detalhes na página
    function renderDetails(data) {
        detailsContainer.innerHTML = `
            <h2>${data.name}</h2>
            <p><strong>Criado em:</strong> ${data.creation || 'Não disponível'}</p>
            <p><strong>Criador:</strong> ${data.creator || 'Não disponível'}</p>
            
            <h3>Descrição</h3>
            <p>${data.description || 'Sem descrição disponível'}</p>
            
            <div class="details-grid">
                <div>
                    <h4>Typing</h4>
                    <p>${data.typing || 'Não especificado'}</p>
                </div>
                
                <div>
                    <h4>Documentação</h4>
                    <a href="${data.docs || '#'}" target="_blank">Acessar</a>
                </div>
                
                <div>
                    <h4>Tutorial</h4>
                    <a href="${data.tutorial || '#'}" target="_blank">Acessar</a>
                </div>
                
                <div>
                    <h4>Download</h4>
                    <a href="${data.download || '#'}" target="_blank">Baixar</a>
                </div>
            </div>
        `;
    }
    
    // Carrega as opções iniciais
    await loadOptions();
});