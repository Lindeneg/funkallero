const getInputFieldValue = (field: HTMLElement | null) => {
    return (field as HTMLInputElement)?.value || null;
};

const setError = (error: string) => {
    const errorDiv = document.getElementById('error-div');

    if (!errorDiv) return;

    errorDiv.innerHTML = `<p style="color:red">${error}</p>`;
};

const sendRequest = async (
    path: string,
    method: string,
    headers?: RequestInit['headers'],
    body?: RequestInit['body'],
    onSuccess?: (response: Response) => void
) => {
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

const postJson = async (path: string, body: RequestInit['body'], onSuccess: (response: Response) => void) => {
    return sendRequest(path, 'POST', { 'Content-Type': 'application/json' }, body, onSuccess);
};

const patchJson = async (path: string, body: RequestInit['body'], onSuccess: (response: Response) => void) => {
    return sendRequest(path, 'PATCH', { 'Content-Type': 'application/json' }, body, onSuccess);
};
