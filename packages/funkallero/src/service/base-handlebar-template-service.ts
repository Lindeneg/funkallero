import { readFile } from 'fs/promises';
import Handlebars from 'handlebars';
import {
    SERVICE,
    injectService,
    SingletonService,
    type ILoggerService,
    type IConfigurationService,
} from '@lindeneg/funkallero-core';

type RenderCoreArgs<TEntries extends TemplateEntries, TKey extends keyof TEntries> = [key: TKey];
type RenderPropsArgs<
    TEntries extends TemplateEntries,
    TKey extends keyof TEntries
> = TEntries[TKey]['data'] extends never ? [] : [props: TEntries[TKey]['data']];

type RenderArgs<TEntries extends TemplateEntries, TKey extends keyof TEntries> = [
    ...RenderCoreArgs<TEntries, TKey>,
    ...RenderPropsArgs<TEntries, TKey>
];

export interface TemplateEntry<TData> {
    path: string;
    data: TData;
    partial?: boolean;
    options?: Parameters<typeof Handlebars.compile>[1];
}

export type TemplateEntries = Record<string, TemplateEntry<any>>;

export type Templates<TEntries extends TemplateEntries> = {
    [TKey in keyof TEntries]: ReturnType<typeof Handlebars.compile<TEntries[TKey]>>;
};

export const createHandlebarTemplate = <TData>(opts: Omit<TemplateEntry<TData>, 'data'>) => {
    return {
        ...opts,
        data: {} as TData,
    } as TemplateEntry<TData>;
};

const STANDARD_HELPERS = {
    funkCsvArray: function (str: string): string[] {
        return str.split(',');
    },
};

abstract class BaseHandlebarTemplateService<TEntries extends TemplateEntries> extends SingletonService {
    @injectService(SERVICE.LOGGER)
    protected readonly logger: ILoggerService;

    @injectService(SERVICE.CONFIGURATION)
    protected readonly config: IConfigurationService;

    protected templates: Templates<TEntries>;

    protected readonly TEMPLATES: TEntries;
    protected readonly enableStandardHelpers: boolean;
    protected readonly Handlebars: typeof Handlebars;

    constructor(handlebars: typeof Handlebars, TEMPLATES: TEntries, enableStandardHelpers = true) {
        super();

        this.Handlebars = handlebars;
        this.TEMPLATES = TEMPLATES;
        this.enableStandardHelpers = enableStandardHelpers;
        this.templates = {} as Templates<TEntries>;
    }

    public async initializeTemplates() {
        const helperPromises = this.enableStandardHelpers ? this.setStandardHelpers() : [];
        const templatePromises = Object.entries(this.TEMPLATES).map(async ([key, value]) => {
            const template = await this.loadTemplate(value.path);

            if (!template) return;

            if ((value as any).partial) {
                this.Handlebars.registerPartial(key, template);
            }

            (this.templates as any)[key] = this.Handlebars.compile(template, {});
        });

        return Promise.all([...templatePromises, ...helperPromises]);
    }

    public async render<TKey extends keyof Templates<TEntries>>(
        ...args: RenderArgs<TEntries, TKey>
    ): Promise<string | null> {
        if (!this.templates) {
            this.logger.warning('templates has not been initialized, yet getTemplate has been called');
            return null;
        }

        if (this.config.meta.isDev) return this.handleDevRender(...args);

        const [key, props] = args;

        return this.templates[key]((props || {}) as any);
    }

    protected setStandardHelpers() {
        return Object.entries(STANDARD_HELPERS).map(async ([key, value]) => {
            this.Handlebars.registerHelper(key, value);
        });
    }

    protected async handleDevRender<TKey extends keyof Templates<TEntries>>(
        ...[key, props]: RenderArgs<TEntries, TKey>
    ): Promise<string | null> {
        const template = await this.loadTemplate(this.TEMPLATES[key].path);

        if (!template) return null;

        return this.Handlebars.compile(template)(props);
    }

    protected async loadTemplate(path: string) {
        try {
            return readFile(path, { encoding: 'utf-8' });
        } catch (error) {
            this.logger.error(`Failed to load template at path: ${path}`);
            return null;
        }
    }
}

export default BaseHandlebarTemplateService;
