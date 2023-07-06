declare const SERVICE_TYPE: Readonly<{
    SINGLETON: "SINGLETON";
    SCOPED: "SCOPED";
}>;
export type ServiceTypeUnion = typeof SERVICE_TYPE[keyof typeof SERVICE_TYPE];
export default SERVICE_TYPE;
