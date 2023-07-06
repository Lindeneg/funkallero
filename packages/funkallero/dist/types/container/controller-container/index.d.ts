import { type Constructor, type IControllerService } from '@lindeneg/funkallero-core';
declare const controllerContainer: {
    get: (name: string) => Constructor<IControllerService> | undefined;
    getAll: () => Constructor<IControllerService>[];
    register: <TController extends Constructor<IControllerService>>(controller: TController) => void;
};
export default controllerContainer;
