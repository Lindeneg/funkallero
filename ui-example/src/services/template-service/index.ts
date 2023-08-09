import { readFile } from 'fs/promises';
import { registerPartial, registerHelper, compile } from 'handlebars';
import { injectService, SingletonService, type ILoggerService, type IConfigurationService } from '@lindeneg/funkallero';
import SERVICE from '@/enums/service';
import TEMPLATES, { type Templates, type Template, type RenderArgs } from './template-data';

class TemplateService extends SingletonService {
    @injectService(SERVICE.LOGGER)
    private readonly logger: ILoggerService;

    @injectService(SERVICE.CONFIGURATION)
    private readonly config: IConfigurationService;

    private templates: Templates;

    public async initializeTemplates() {
        this.templates = {} as Templates;

        registerHelper('csvArray', TemplateService.csvArrayHelper);

        await Promise.all(
            Object.entries(TEMPLATES).map(async ([key, value]) => {
                const template = await this.loadTemplate(value.path);

                if (!template) return;

                if ((value as any).partial) {
                    registerPartial(key, template);
                }

                (this.templates as any)[key] = compile(template);
            })
        );
    }

    public async render<TKey extends keyof Template>(...args: RenderArgs<TKey>): Promise<string | null> {
        if (!this.templates) {
            this.logger.warning('templates has not been initialized, yet getTemplate has been called');
            return null;
        }

        if (this.config.meta.isDev) return this.handleDevRender(...args);

        const [key, props] = args;

        return this.templates[key](props || {});
    }

    private async handleDevRender<TKey extends keyof Template>(
        ...[key, props]: RenderArgs<TKey>
    ): Promise<string | null> {
        const template = await this.loadTemplate(TEMPLATES[key].path);

        if (!template) return null;

        return compile(template)(props);
    }

    private async loadTemplate(path: string) {
        try {
            return readFile(path, { encoding: 'utf-8' });
        } catch (error) {
            this.logger.error(`Failed to load template at path: ${path}`);
            return null;
        }
    }

    public static csvArrayHelper(str: string): string[] {
        return str.split(',');
    }
}

export default TemplateService;
