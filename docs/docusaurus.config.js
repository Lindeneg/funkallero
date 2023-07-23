// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Funkallero',
    tagline: 'Funkallero Documentation',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://lindeneg.github.io',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/funkallero',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'lindeneg', // Usually your GitHub org/user name.
    projectName: 'funkallero', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: 'Funkallero',
                items: [
                    {
                        type: 'docSidebar',
                        sidebarId: 'tutorialSidebar',
                        position: 'left',
                        label: 'Documentation',
                    },
                    {
                        href: 'https://github.com/lindeneg/funkallero',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Acknowledgments',
                        items: [
                            {
                                label: 'Docusaurus',
                                href: 'https://github.com/facebook/docusaurus',
                            },
                            {
                                label: 'unDraw',
                                href: 'https://undraw.co',
                            },
                            {
                                label: 'Express',
                                href: 'https://expressjs.com',
                            },
                        ],
                    },
                    {
                        title: 'Author',
                        items: [
                            {
                                label: 'Website',
                                href: 'https://lindeneg.org',
                            },
                            {
                                label: 'GitHub',
                                href: 'https://github.com/lindeneg',
                            },
                        ],
                    },
                ],
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
                magicComments: [
                    {
                        className: 'code-block-error-line',
                        line: 'error-next-line',
                    },
                    {
                        className: 'theme-code-block-highlighted-line',
                        line: 'highlight-next-line',
                        block: { start: 'highlight-start', end: 'highlight-end' },
                    },
                    {
                        className: 'code-block-diff-add',
                        line: 'diff-add-next-line',
                        block: { start: 'diff-add-start', end: 'diff-add-end' },
                    },
                    {
                        className: 'code-block-diff-remove',
                        line: 'diff-remove-next-line',
                        block: { start: 'diff-remove-start', end: 'diff-remove-end' },
                    },
                ],
            },
        }),
};

module.exports = config;
