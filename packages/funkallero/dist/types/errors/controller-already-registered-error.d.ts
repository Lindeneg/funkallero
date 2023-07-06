declare class ControllerAlreadyRegisteredError extends Error {
    constructor(controllerName: string);
}
export default ControllerAlreadyRegisteredError;
