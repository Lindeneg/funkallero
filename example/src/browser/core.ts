type Core = typeof window['funkalleroCore'];

(() => {
    const logoutBtn = document.getElementById('logout-btn');
    const keyPressSingleHandlerMap = new Map<string, () => void>();

    const debounce = (fn: Function, ms = 300) => {
        let timeoutId: ReturnType<typeof setTimeout>;
        return function (this: unknown, ...args: unknown[]) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), ms);
        };
    };

    const handleKeyPress = ({ key }: KeyboardEvent) => {
        if (keyPressSingleHandlerMap.has(key)) {
            keyPressSingleHandlerMap.get(key)?.();
            return;
        }
    };

    const handleLogout = () => {
        window.location.href = '/logout';
    };

    document.addEventListener('keypress', debounce(handleKeyPress));
    logoutBtn?.addEventListener('click', handleLogout);

    const setKeyPressHandler: Core['setKeyPressHandler'] = (key, handler) => {
        keyPressSingleHandlerMap.set(key, handler);
    };

    const getInputFieldValue: Core['getInputFieldValue'] = (field) => {
        return (field as HTMLInputElement)?.value || null;
    };

    const setError = (error: string) => {
        const errorDiv = document.getElementById('error-div');

        if (!errorDiv) return;

        errorDiv.innerHTML = `<p style="color:red">${error}</p>`;
    };

    const sendRequest: Core['sendRequest'] = async (path, method, headers, body, onSuccess) => {
        const opts: RequestInit = { method, headers };

        if (method !== 'GET' && body) {
            opts.body = body;
        }

        const response = await fetch('/api' + path, opts);

        if (response.ok) {
            if (onSuccess) return onSuccess(response);
            return response;
        }

        const { message, error } = await response.json();

        if (Array.isArray(error)) {
            setError(JSON.stringify(error));
        } else {
            setError(message);
        }
    };

    const postJson: Core['postJson'] = async (path, body, onSuccess) => {
        return sendRequest(path, 'POST', { 'Content-Type': 'application/json' }, body, onSuccess);
    };

    const patchJson: Core['patchJson'] = async (path, body, onSuccess) => {
        return sendRequest(path, 'PATCH', { 'Content-Type': 'application/json' }, body, onSuccess);
    };

    window.funkalleroCore = {
        sendRequest,
        postJson,
        patchJson,
        setError,
        getInputFieldValue,
        setKeyPressHandler,
    };
})();
