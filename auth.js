// auth.js - Общая система авторизации для всех страниц

// Состояние пользователя
let userState = {
    isLoggedIn: false,
    userName: '',
    userEmail: '',
    userInitials: ''
};

// Загрузка состояния из localStorage
function loadUserState() {
    const saved = localStorage.getItem('userState');
    if (saved) {
        userState = JSON.parse(saved);
    }
}

// Сохранение состояния в localStorage
function saveUserState() {
    localStorage.setItem('userState', JSON.stringify(userState));
}

// Инициализация шапки на всех страницах
function initHeader() {
    loadUserState();
    renderAuthSection();
    setupMobileMenu();
}

// Рендер секции авторизации
function renderAuthSection() {
    const authSection = document.getElementById('auth-section');
    if (!authSection) return;
    
    if (userState.isLoggedIn) {
        authSection.innerHTML = `
            <div class="user-profile" id="user-profile">
                <div class="user-avatar">${userState.userInitials}</div>
                <div class="user-name">${userState.userName}</div>
                <div class="user-menu" id="user-menu">
                    <a href="profile.html" class="user-menu-item">
                        <i class="fas fa-user"></i> Мой профиль
                    </a>
                    <a href="orders.html" class="user-menu-item">
                        <i class="fas fa-list"></i> Мои заказы
                    </a>
                    <button class="user-menu-item" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> Выйти
                    </button>
                </div>
            </div>
        `;

        // Обработчики для меню пользователя
        const userProfile = document.getElementById('user-profile');
        const userMenu = document.getElementById('user-menu');
        
        if (userProfile && userMenu) {
            userProfile.addEventListener('click', function(e) {
                e.stopPropagation();
                userMenu.classList.toggle('show');
            });

            document.addEventListener('click', function() {
                userMenu.classList.remove('show');
            });
        }
    } else {
        authSection.innerHTML = `
            <div class="auth-buttons">
                <a href="login.html" class="btn btn-small">
                    <i class="fas fa-sign-in-alt"></i> Войти
                </a>
                <a href="register.html" class="btn btn-small btn-outline">
                    <i class="fas fa-user-plus"></i> Регистрация
                </a>
            </div>
        `;
    }
}

// Мобильное меню
function setupMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navContainer = document.querySelector('.nav-container');
    
    if (mobileMenu && navContainer) {
        mobileMenu.addEventListener('click', function() {
            navContainer.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!navContainer.contains(e.target) && !mobileMenu.contains(e.target)) {
                navContainer.classList.remove('show');
            }
        });
    }
}

// Функция выхода
function logout() {
    userState.isLoggedIn = false;
    userState.userName = '';
    userState.userEmail = '';
    userState.userInitials = '';
    
    saveUserState();
    renderAuthSection();
    showNotification('Вы успешно вышли из системы', 'info');
    
    // Перенаправление на главную страницу
    setTimeout(() => {
        if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
            window.location.href = 'index.html';
        }
    }, 1000);
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initHeader();
});