class NoControllersFoundError extends Error {
    constructor() {
        super(
            'No controllers found! Did you use the controller decorator? ' +
                'Did you import the controller in your entry file?'
        );
    }
}

export default NoControllersFoundError;
