import { joinPath, logger, toKebabCase, toPascalCase } from '@lindeneg/scaffold-core';
import { baseServices } from '@/modules';
import type { ConfigureModuleFn, ServiceType } from './preparation';

const serviceConfigureFactory = (type: ServiceType) => (configure: ConfigureModuleFn) => {
    configure(baseServices, (cxt) => {
        if (!cxt.answers.name) return;
        const kebabedName = toKebabCase(cxt.answers.name);
        const serviceName = toPascalCase(cxt.answers.name);
        const name = kebabedName + '-service';
        const enumName = kebabedName.replace(/-/g, '_').toUpperCase();
        const fileName = name + '.ts';
        const filePath = joinPath(cxt.servicesPath, fileName);
        const className = serviceName + 'Service';

        logger.verbose({
            msg: 'Creating service',
            type,
            name,
            className,
            enumName,
            serviceName,
            fileName,
            filePath,
        });

        cxt.customActions.add(
            baseServices.templates.service.addFile(filePath, {
                serviceName,
                BaseService: type,
            }),
            baseServices.actions.addServiceToServiceEnum.prepare({
                rootDir: cxt.enumPath,
                enumName,
            }),
            baseServices.actions.addServiceImportToMainIndex.prepare({
                rootDir: cxt.projectSrc,
                importString: `import ${className} from '@/services/${name}';`,
            }),
            baseServices.actions.registerServiceInMainIndex.prepare({
                rootDir: cxt.projectSrc,
                className,
                enumName,
                type,
            })
        );
    });
};

export default serviceConfigureFactory;
