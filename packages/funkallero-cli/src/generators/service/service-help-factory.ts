import type { ServiceType } from './preparation';

const serviceHelpFactory = (type: ServiceType) => {
    const command = type === 'SingletonService' ? 'singleton' : 'scoped';
    return `Funkallero ${type} Generator

Create a new service in src/services, adds the service to
src/enums/service.ts and registers the service in src/index.ts.

$ funkallero ${command} ...NAME

NAME:    Service name

Examples:

$ funkallero ${command} some name

$ funkallero ${command} some other name
`;
};

export default serviceHelpFactory;
