(() => {
    const getUpdateSectionTemplate = (name: string, description: string) => {
        return `<hr />
<h1>Update Book</h1>
<form class="pure-form pure-form-aligned">
    <fieldset>
        <div class="pure-control-group">
            <label for="aligned-name">Book Name</label>
            <input type="text" id="name-field" placeholder="Name" value="${name}" />
        </div>
        <div class="pure-control-group">
            <label for="aligned-description">Book Description</label>
            <input type="text" id="description-field" placeholder="Description" value="${description}" />
        </div>
        <div class="pure-controls">
            <button id="update-button" type="button" class="pure-button pure-button-primary">Update Book</button>
            <button id="cancel-button" type="button" class="pure-button pure-button-secondary">Cancel</button>
        </div>
    </fieldset>
<div id="error-div"></div>
</form>`;
    };

    const setUpdateSectionListeners = (
        bookId: string,
        section: HTMLElement,
        originalName: string,
        originalDescription: string
    ) => {
        const updateButton = section.querySelector('#update-button');
        const cancelButton = section.querySelector('#cancel-button');

        updateButton?.addEventListener('click', () => {
            const name = getInputFieldValue(section.querySelector('#name-field'));
            const description = getInputFieldValue(section.querySelector('#description-field'));

            if (name === originalName && description === originalDescription) {
                setError('Please make a change to a field..');
                return;
            }

            return patchJson('/books/' + bookId, JSON.stringify({ name, description }), () => {
                window.location.href = '/';
            });
        });

        cancelButton?.addEventListener('click', () => {
            section.innerHTML = '';
        });
    };

    const setUpdateSectionTemplate = (bookId: string, name: string, description: string) => {
        const updateSection = document.getElementById('update-book-section');

        if (!updateSection) return;

        const template = getUpdateSectionTemplate(name, description);

        updateSection.innerHTML = template;

        setUpdateSectionListeners(bookId, updateSection, name, description);
    };

    const remove = async (bookId: string) => {
        return sendRequest('/books/' + bookId, 'DELETE', undefined, undefined, () => {
            window.location.href = '/';
        });
    };

    const main = () => {
        const actionElements = document.querySelectorAll('.update,.delete');

        actionElements.forEach((element) => {
            element.addEventListener('click', ({ target }: any) => {
                const isUpdate = target.classList.contains('update');
                const bookId = target.parentNode.getAttribute('data-book-id');

                if (!isUpdate) return remove(bookId);

                const updateSection = document.getElementById('update-book-section');

                if (!updateSection) return;

                const name = target.parentNode.getAttribute('data-book-name');
                const description = target.parentNode.getAttribute('data-book-description');

                setUpdateSectionTemplate(bookId, name, description);
            });
        });
    };

    main();
})();
