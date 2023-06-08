function validateDecoratorFactory<TSchema>(property: string, schema: TSchema) {
    return function (target: any, key: string, _: PropertyDescriptor) {
        if (!target.validation) {
            target.validation = {};
        }

        if (!target.validation[key]) {
            target.validation[key] = {};
        }

        target.validation[key][property] = schema;
    };
}

export default validateDecoratorFactory;
