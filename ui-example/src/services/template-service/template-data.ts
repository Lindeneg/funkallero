import type { compile } from 'handlebars';

const TEMPLATE_DATA = {
    HOME: {
        path: 'templates/index.hbs',
        data: {} as Record<'doesWhat', string>,
    },
    HOME2: {
        path: 'templates/index.hbs',
        data: {} as Record<'whatever', string>,
    },
    HEAD: {
        path: 'templates/head.hbs',
        data: {} as never,
        partial: true,
    },
} as const;

export type Template = typeof TEMPLATE_DATA;

export type TemplateData<TKey extends keyof Template> = Template[TKey]['data'];

export type Templates = {
    [TKey in keyof Template]: ReturnType<typeof compile<TemplateData<TKey>>>;
};

type RenderCoreArgs<TKey extends keyof Template> = [key: TKey];
type RenderPropsArgs<TKey extends keyof Template> = TemplateData<TKey> extends never ? [] : [props: TemplateData<TKey>];

export type RenderArgs<TKey extends keyof Template> = [...RenderCoreArgs<TKey>, ...RenderPropsArgs<TKey>];

export default TEMPLATE_DATA;
