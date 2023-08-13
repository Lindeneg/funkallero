interface FunkalleroCore {
    sendRequest: (
        path: string,
        method: string,
        headers?: RequestInit['headers'],
        body?: RequestInit['body'],
        onSuccess?: (response: Response) => void
    ) => Promise<void | Response>;

    postJson: (
        path: string,
        body: RequestInit['body'],
        onSuccess: (response: Response) => void
    ) => Promise<void | Response>;

    patchJson: (
        path: string,
        body: RequestInit['body'],
        onSuccess: (response: Response) => void
    ) => Promise<void | Response>;

    setError: (error: string) => void;

    getInputFieldValue: (field: HTMLElement | null) => HTMLInputElement['value'] | null;

    setKeyPressHandler: (key: string, handler: () => void) => void;
}

interface Window {
    funkalleroCore: FunkalleroCore;
}
