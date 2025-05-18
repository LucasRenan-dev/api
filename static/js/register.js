document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('senha');
    const togglePassword = document.querySelector('.toggle-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text span');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');
    const notification = document.getElementById('notification');

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        togglePassword.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });

    // Password strength indicator
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strength = calculatePasswordStrength(password);
        
        updateStrengthIndicator(strength);
    });

    // Form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset errors
        clearErrors();
        
        // Validate inputs
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: e.target.nome.value,
                    email: e.target.email.value,
                    senha: e.target.senha.value
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showNotification(result.message || 'Cadastro realizado com sucesso!', 'success');
                registerForm.reset();
                
                // Optional: Redirect after successful registration
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                showNotification(result.error || 'Erro no cadastro', 'error');
                
                // Show field errors if available
                if (result.errors) {
                    Object.entries(result.errors).forEach(([field, message]) => {
                        const errorElement = document.getElementById(`${field}-error`);
                        if (errorElement) {
                            errorElement.textContent = message;
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Erro na conexão com o servidor', 'error');
        } finally {
            // Hide loading state
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
        }
    });

    // Helper functions
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        // Length
        if (password.length > 0) strength += 1;
        if (password.length >= 8) strength += 1;
        
        // Complexity
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        return Math.min(strength, 5);
    }

    function updateStrengthIndicator(strength) {
        const percentage = (strength / 5) * 100;
        const colors = [
            '#ef233c', // Red (very weak)
            '#f8961e', // Orange (weak)
            '#f9c74f', // Yellow (medium)
            '#90be6d', // Light green (strong)
            '#43aa8b'  // Green (very strong)
        ];
        
        strengthBar.style.width = `${percentage}%`;
        strengthBar.style.backgroundColor = colors[strength - 1] || colors[0];
        
        const texts = [
            'Muito fraca',
            'Fraca',
            'Média',
            'Forte',
            'Muito forte'
        ];
        
        strengthText.textContent = texts[strength - 1] || texts[0];
        strengthText.style.color = colors[strength - 1] || colors[0];
    }

    function validateForm() {
        let isValid = true;
        
        // Name validation
        const nome = registerForm.nome.value.trim();
        if (nome.length < 3) {
            document.getElementById('nome-error').textContent = 'O nome deve ter pelo menos 3 caracteres';
            isValid = false;
        }
        
        // Email validation
        const email = registerForm.email.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('email-error').textContent = 'Por favor, insira um email válido';
            isValid = false;
        }
        
        // Password validation
        const senha = registerForm.senha.value;
        if (senha.length < 8) {
            document.getElementById('senha-error').textContent = 'A senha deve ter pelo menos 8 caracteres';
            isValid = false;
        }
        
        return isValid;
    }

    function clearErrors() {
        document.querySelectorAll('.input-error').forEach(el => {
            el.textContent = '';
        });
    }

    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
});