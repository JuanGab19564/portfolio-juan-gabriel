/* SecureAuth - JS | Author: Juan Gabriel Aragón */
'use strict';
const Auth = {
    showPanel(id) {
        document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    },
    togglePassword(btn) {
        const input = btn.previousElementSibling;
        input.type = input.type === 'password' ? 'text' : 'password';
    },
    checkStrength(val) {
        const fill = document.getElementById('strength-fill');
        const text = document.getElementById('strength-text');
        let score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;
        const levels = [
            { w: '0%', c: '', t: 'Ingresa una contraseña' },
            { w: '25%', c: '#ef4444', t: 'Débil' },
            { w: '50%', c: '#f59e0b', t: 'Regular' },
            { w: '75%', c: '#3b82f6', t: 'Buena' },
            { w: '100%', c: '#22c55e', t: 'Fuerte 💪' }
        ];
        const level = levels[score];
        fill.style.width = level.w;
        fill.style.background = level.c;
        text.textContent = level.t;
        text.style.color = level.c || '#64748b';
    },
    login() {
        document.getElementById('success-msg').textContent = '¡Inicio de sesión exitoso! Redirigiendo al dashboard...';
        this.showPanel('success-panel');
    },
    register() {
        document.getElementById('success-msg').textContent = '¡Cuenta creada exitosamente! Revisa tu correo para confirmar.';
        this.showPanel('success-panel');
    },
    recover() {
        document.getElementById('success-msg').textContent = '¡Email enviado! Revisa tu bandeja de entrada para restablecer tu contraseña.';
        this.showPanel('success-panel');
    }
};
console.log('🔐 SecureAuth - Desarrollado por Juan Gabriel Aragón');
