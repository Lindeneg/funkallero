(() => {
    sendRequest('/logout', 'GET', undefined, undefined, () => {
        window.location.href = '/';
    });
})();
