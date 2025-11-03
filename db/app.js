// Variáveis globais
const API_URL = '';
let currentUser = null;
let currentPage = 1;
const itemsPerPage = 5;

// Funções de autenticação
function checkAuthentication() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        document.getElementById('user-name').textContent = currentUser.nome;
        document.querySelectorAll('.auth-required').forEach(el => el.style.display = 'block');
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('restricted-message').style.display = 'none';
        
        // Mostrar container de notícias se estiver na página principal
        if (document.getElementById('patients-container')) {
            document.getElementById('patients-container').style.display = 'block';
            loadNoticias();
        }
        
        // Mostrar formulário de cadastro se estiver na página principal
        if (document.getElementById('patient-form-container')) {
            document.getElementById('patient-form-container').style.display = 'block';
        }
        
        // Carregar detalhes da notícia se estiver na página de detalhes
        if (document.getElementById('patient-details')) {
            const urlParams = new URLSearchParams(window.location.search);
            const noticiaId = urlParams.get('id');
            if (noticiaId) {
                loadNoticiaDetails(noticiaId);
            } else {
                window.location.href = 'index.html';
            }
        }
    } else {
        document.querySelectorAll('.auth-required').forEach(el => el.style.display = 'none');
        if (document.getElementById('login-container')) {
            document.getElementById('login-container').style.display = 'block';
        }
        if (document.getElementById('restricted-message')) {
            document.getElementById('restricted-message').style.display = 'block';
        }
    }
}

async function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const messageEl = document.getElementById('login-message');
    
    try {
        // Corrigindo o problema de CORS usando o caminho relativo
        const response = await fetch(`/usuarios?email=${email}`);
        const users = await response.json();
        
        if (users.length === 0) {
            messageEl.textContent = 'Usuário não encontrado';
            messageEl.className = 'message error';
            return;
        }
        
        const user = users[0];
        if (user.senha !== senha) {
            messageEl.textContent = 'Senha incorreta';
            messageEl.className = 'message error';
            return;
        }
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        messageEl.textContent = 'Login realizado com sucesso!';
        messageEl.className = 'message success';
        
        setTimeout(() => {
            checkAuthentication();
        }, 1000);
        
    } catch (error) {
        messageEl.textContent = 'Erro ao fazer login: ' + error.message;
        messageEl.className = 'message error';
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    checkAuthentication();
    if (window.location.pathname.includes('detalhes.html')) {
        window.location.href = 'index.html';
    }
}

// Funções para gerenciar notícias
async function loadNoticias() {
    const searchInput = document.getElementById('search-input');
    let url = `${API_URL}/noticias?_page=${currentPage}&_limit=${itemsPerPage}`;
    
    if (searchInput && searchInput.value) {
        url += `&titulo_like=${searchInput.value}`;
    }
    
    try {
        const response = await fetch(url);
        const noticias = await response.json();
        
        // Obter total de notícias para paginação
        const totalCount = response.headers.get('X-Total-Count');
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        
        displayNoticias(noticias);
        updatePagination(totalPages);
        
    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
    }
}

function displayNoticias(noticias) {
    const container = document.getElementById('patients-list');
    container.innerHTML = '';
    
    if (noticias.length === 0) {
        container.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
        return;
    }
    
    noticias.forEach(noticia => {
        const noticiaEl = document.createElement('div');
        noticiaEl.className = 'patient-card';
        
        const dataFormatada = new Date(noticia.data).toLocaleDateString('pt-BR');
        
        noticiaEl.innerHTML = `
            <h3>${noticia.titulo}</h3>
            <p><strong>Autor:</strong> ${noticia.autor}</p>
            <p><strong>Data:</strong> ${dataFormatada}</p>
            <p><strong>Categoria:</strong> ${noticia.categoria}</p>
            <div class="patient-actions">
                <a href="detalhes.html?id=${noticia.id}" class="btn btn-secondary">Ver Detalhes</a>
                <button class="btn btn-danger" onclick="deleteNoticia(${noticia.id})">Excluir</button>
            </div>
        `;
        
        container.appendChild(noticiaEl);
    });
}

function updatePagination(totalPages) {
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            loadNoticias();
        }
    };
    
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadNoticias();
        }
    };
}

async function createNoticia(event) {
    event.preventDefault();
    
    const noticia = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        data: document.getElementById('data').value,
        categoria: document.getElementById('categoria').value,
        conteudo: document.getElementById('conteudo').value
    };
    
    const messageEl = document.getElementById('form-message');
    
    try {
        const response = await fetch(`${API_URL}/noticias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noticia)
        });
        
        if (response.ok) {
            messageEl.textContent = 'Notícia cadastrada com sucesso!';
            messageEl.className = 'message success';
            document.getElementById('form-patient').reset();
            loadNoticias();
        } else {
            throw new Error('Erro ao cadastrar notícia');
        }
    } catch (error) {
        messageEl.textContent = 'Erro ao cadastrar notícia: ' + error.message;
        messageEl.className = 'message error';
    }
}

async function loadNoticiaDetails(id) {
    try {
        const response = await fetch(`${API_URL}/noticias/${id}`);
        if (!response.ok) {
            throw new Error('Notícia não encontrada');
        }
        
        const noticia = await response.json();
        
        document.getElementById('patient-id').value = noticia.id;
        document.getElementById('titulo').value = noticia.titulo;
        document.getElementById('autor').value = noticia.autor;
        document.getElementById('data').value = noticia.data;
        document.getElementById('categoria').value = noticia.categoria;
        document.getElementById('conteudo').value = noticia.conteudo;
        
    } catch (error) {
        console.error('Erro ao carregar detalhes da notícia:', error);
        alert('Erro ao carregar detalhes da notícia: ' + error.message);
        window.location.href = 'index.html';
    }
}

async function updateNoticia(event) {
    event.preventDefault();
    
    const id = document.getElementById('patient-id').value;
    const noticia = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        data: document.getElementById('data').value,
        categoria: document.getElementById('categoria').value,
        conteudo: document.getElementById('conteudo').value
    };
    
    const messageEl = document.getElementById('form-message');
    
    try {
        const response = await fetch(`${API_URL}/noticias/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noticia)
        });
        
        if (response.ok) {
            messageEl.textContent = 'Notícia atualizada com sucesso!';
            messageEl.className = 'message success';
        } else {
            throw new Error('Erro ao atualizar notícia');
        }
    } catch (error) {
        messageEl.textContent = 'Erro ao atualizar notícia: ' + error.message;
        messageEl.className = 'message error';
    }
}

async function deleteNoticia(id) {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/noticias/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadNoticias();
        } else {
            throw new Error('Erro ao excluir notícia');
        }
    } catch (error) {
        console.error('Erro ao excluir notícia:', error);
        alert('Erro ao excluir notícia: ' + error.message);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    
    // Login form
    const loginForm = document.getElementById('form-login');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            loadNoticias();
        });
    }
    
    // Create noticia form
    const createForm = document.getElementById('form-patient');
    if (createForm && window.location.pathname.includes('index.html')) {
        createForm.addEventListener('submit', createNoticia);
    }
    
    // Update noticia form
    const updateForm = document.getElementById('form-edit-patient');
    if (updateForm) {
        updateForm.addEventListener('submit', updateNoticia);
    }
});