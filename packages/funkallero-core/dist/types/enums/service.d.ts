import { type SingletonServiceUnion } from './singleton-service';
import { type ScopedServiceUnion } from './scoped-service';
declare const SERVICE: Readonly<{
    AUTHORIZATION: "AUTHORIZATION";
    AUTHENTICATION: "AUTHENTICATION";
    MEDIATOR: "MEDIATOR";
    DATA_CONTEXT: "DATA_CONTEXT";
    EXPRESS: "EXPRESS";
    CONFIGURATION: "CONFIGURATION";
    LOGGER: "LOGGER";
    ERROR_HANDLER: "ERROR_HANDLER";
    SCHEMA_PARSER: "SCHEMA_PARSER";
    TOKEN: "TOKEN";
}>;
export type ServiceUnion = ScopedServiceUnion | SingletonServiceUnion;
export default SERVICE;
