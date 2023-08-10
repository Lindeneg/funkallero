(() => {
    const createBtn = document.getElementById('create-button');

    const createBook = async () => {
        const name = window.funkalleroCore.getInputFieldValue(document.getElementById('name-field'));
        const description = window.funkalleroCore.getInputFieldValue(document.getElementById('description-field'));

        if (!name || !description) {
            window.funkalleroCore.setError('Please fill in all fields');
            return;
        }
        const body = JSON.stringify({ name, description });

        return window.funkalleroCore.postJson('/books', body, () => {
            window.location.href = '/';
        });
    };

    window.funkalleroCore.setKeyPressHandler('Enter', createBook);
    createBtn?.addEventListener('click', createBook);
})();
