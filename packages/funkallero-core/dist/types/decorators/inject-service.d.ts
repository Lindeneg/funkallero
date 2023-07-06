declare function injectService(serviceKey: string): (target: any, instanceMember: string) => any;
export default injectService;
