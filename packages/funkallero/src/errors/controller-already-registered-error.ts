class ControllerAlreadyRegisteredError extends Error {
    constructor(controllerName: string) {
        super(`Controller with name ${controllerName} already registered`);
    }
}

export default ControllerAlreadyRegisteredError;
