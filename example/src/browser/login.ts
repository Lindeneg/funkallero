(() => {
    const isSignup = window.location.href.includes('signup');

    const login = async (email: string, password: string, name: string | null = null) => {
        const url = isSignup ? '/signup' : '/login';
        const body = JSON.stringify(isSignup ? { email, password, name } : { email, password });

        return postJson(url, body, () => {
            window.location.href = '/';
        });
    };

    const main = () => {
        const loginBtn = document.getElementById('login-button');

        if (!loginBtn) return;

        loginBtn.addEventListener('click', async () => {
            const email = getInputFieldValue(document.getElementById('email-field'));
            const password = getInputFieldValue(document.getElementById('password-field'));
            const name = getInputFieldValue(document.getElementById('name-field'));

            if (!email || !password || (isSignup && !name)) {
                setError('Please fill in all fields');
                return;
            }

            await login(email, password, name);
        });
    };

    main();
})();
