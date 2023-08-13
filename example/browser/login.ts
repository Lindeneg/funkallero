(() => {
    const loginBtn = document.getElementById('login-button');
    const isSignup = window.location.href.includes('signup');

    const login = async () => {
        const email = window.funkalleroCore.getInputFieldValue(document.getElementById('email-field'));
        const password = window.funkalleroCore.getInputFieldValue(document.getElementById('password-field'));
        const name = window.funkalleroCore.getInputFieldValue(document.getElementById('name-field'));

        if (!email || !password || (isSignup && !name)) {
            window.funkalleroCore.setError('Please fill in all fields');
            return;
        }

        const url = isSignup ? '/signup' : '/login';
        const body = JSON.stringify(isSignup ? { email, password, name } : { email, password });

        return window.funkalleroCore.postJson(url, body, () => {
            window.location.href = '/';
        });
    };

    window.funkalleroCore.setKeyPressHandler('Enter', login);
    loginBtn?.addEventListener('click', login);
})();
