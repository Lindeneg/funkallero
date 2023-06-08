class NotImplementedError extends Error {
    constructor(name: string) {
        super(`${name} is not implemented`);
    }
}

export default NotImplementedError;
