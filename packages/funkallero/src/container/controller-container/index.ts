import type { Constructor, IControllerService } from '@lindeneg/funkallero-core';
import ControllerAlreadyRegisteredError from '../../errors/controller-already-registered-error';
import devLogger from '../../dev-logger';

const controllers = new Map<string, Constructor<IControllerService>>();

const getControllers = () => Array.from(controllers.values());

const getController = (name: string) => controllers.get(name);

const registerController = <TController extends Constructor<IControllerService>>(controller: TController) => {
    if (controllers.has(controller.name)) {
        throw new ControllerAlreadyRegisteredError(controller.name);
    }

    devLogger(`registering controller with name ${controller.name}`);

    controllers.set(controller.name, controller);
};

const controllerContainer = {
    get: getController,
    getAll: getControllers,
    register: registerController,
};

export default controllerContainer;
