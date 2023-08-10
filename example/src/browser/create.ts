(() => {
    const create = async (name: string, description: string) => {
        const body = JSON.stringify({ name, description });

        return postJson('/books', body, () => {
            window.location.href = '/';
        });
    };

    const main = () => {
        const createBtn = document.getElementById('create-button');

        if (!createBtn) return;

        createBtn.addEventListener('click', async () => {
            const name = getInputFieldValue(document.getElementById('name-field'));
            const description = getInputFieldValue(document.getElementById('description-field'));

            if (!name || !description) {
                setError('Please fill in all fields');
                return;
            }

            await create(name, description);
        });
    };

    main();
})();
