// Auth check and logout functionality
fetch('/check-auth')
  .then(response => response.json())
  .then(data => {
    if (!data.authenticated) {
      window.location.href = '/login';
    }
  });

document.getElementById('logoutBtn').addEventListener('click', () => {
  fetch('/logout', { method: 'POST' })
    .then(() => window.location.href = '/login');
});

document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements
    const typeSelect = document.getElementById('requestType');
    const optionSelect = document.getElementById('requestOption');
    const fetchBtn = document.getElementById('fetchBtn');
    const backBtn = document.getElementById('backBtn');
    const detailsContainer = document.getElementById('details-container');
    
    // State variables
    let currentList = [];
    let currentView = 'list';
    
    // Event listeners
    typeSelect.addEventListener('change', loadOptions);
    fetchBtn.addEventListener('click', showDetails);
    backBtn.addEventListener('click', returnToListView);
    
    // Load initial options
    await loadOptions();
    
    // Functions
    async function loadOptions() {
        const type = typeSelect.value;
        try {
            showLoading(optionSelect, 'Carregando opções...');
            
            const response = await fetch(`http://127.0.0.1:5000/${type}`);
            if (!response.ok) throw new Error('Erro ao carregar opções');
            
            currentList = await response.json();
            updateOptions();
        } catch (error) {
            console.error('Erro:', error);
            showError(detailsContainer, error.message);
        }
    }
    
    function updateOptions() {
        optionSelect.innerHTML = '';
        
        if (currentList.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Nenhuma opção disponível';
            optionSelect.appendChild(option);
            return;
        }
        
        currentList.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            optionSelect.appendChild(option);
        });
    }
    
    async function showDetails() {
        const type = typeSelect.value;
        const id = optionSelect.value;
        
        if (!id || id === '') {
            showError(detailsContainer, 'Por favor, selecione um item');
            return;
        }
        
        try {
            showLoading(detailsContainer, 'Carregando detalhes...');
            
            const response = await fetch(`http://127.0.0.1:5000/${type}/${id}`);
            if (!response.ok) throw new Error('Item não encontrado');
            
            const data = await response.json();
            renderDetails(data);
            switchToDetailView();
        } catch (error) {
            console.error('Erro:', error);
            showError(detailsContainer, error.message);
        }
    }
    
    function renderDetails(data) {
        detailsContainer.innerHTML = `
            <div class="detail-header">
                <h2>${data.name}</h2>
                <div class="meta-info">
                    ${data.creation ? `<span><i class="fas fa-calendar-alt"></i> ${data.creation}</span>` : ''}
                    ${data.creator ? `<span><i class="fas fa-user-tie"></i> ${data.creator}</span>` : ''}
                </div>
            </div>
            
            <div class="detail-content">
                <h3><i class="fas fa-align-left"></i> Descrição</h3>
                <p>${data.description || 'Sem descrição disponível'}</p>
                
                <div class="details-grid">
                    ${data.typing ? `
                    <div class="detail-card">
                        <h4><i class="fas fa-keyboard"></i> Typing</h4>
                        <p>${data.typing}</p>
                    </div>
                    ` : ''}
                    
                    ${data.docs ? `
                    <div class="detail-card">
                        <h4><i class="fas fa-book"></i> Documentação</h4>
                        <a href="${data.docs}" target="_blank">Acessar <i class="fas fa-external-link-alt"></i></a>
                    </div>
                    ` : ''}
                    
                    ${data.tutorial ? `
                    <div class="detail-card">
                        <h4><i class="fas fa-graduation-cap"></i> Tutorial</h4>
                        <a href="${data.tutorial}" target="_blank">Acessar <i class="fas fa-external-link-alt"></i></a>
                    </div>
                    ` : ''}
                    
                    ${data.download ? `
                    <div class="detail-card">
                        <h4><i class="fas fa-download"></i> Download</h4>
                        <a href="${data.download}" target="_blank">Baixar <i class="fas fa-external-link-alt"></i></a>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    function switchToDetailView() {
        fetchBtn.style.display = 'none';
        backBtn.style.display = 'inline-block';
        currentView = 'details';
    }
    
    function returnToListView() {
        detailsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-info-circle"></i>
                <p>Selecione um item para visualizar os detalhes</p>
            </div>
        `;
        backBtn.style.display = 'none';
        fetchBtn.style.display = 'inline-block';
        currentView = 'list';
    }
    
    function showLoading(element, message = 'Carregando...') {
        element.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>${message}</p>
            </div>
        `;
    }
    
    function showError(element, message) {
        element.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
    }
});