import handlebars from 'handlebars';
import logger from '../logger';

export const safeStringsOnly = <T>(obj: T) => {
    for (const key in obj) {
        if (typeof obj[key] === 'undefined') continue;
        const value = obj[key];
        if (typeof value === 'object') {
            safeStringsOnly(value);
        } else if (typeof value === 'string') {
            obj[key] = new handlebars.SafeString(value) as T[Extract<keyof T, string>];
        }
    }
    return obj;
};

export const parseJsonOrNull = <TType>(...[src, ...opts]: Parameters<typeof JSON.parse>): TType | null => {
    try {
        return JSON.parse(src, ...opts);
    } catch (err) {
        logger.error({
            msg: 'failed to parse json',
            source: 'utils.parseJsonOrNull',
            err,
        });
    }
    return null;
};

export const stringifyJsonOrFallback = (
    fallback: string,
    ...[src, ...opts]: Parameters<typeof JSON.stringify>
): string => {
    try {
        return JSON.stringify(src, ...opts);
    } catch (err) {
        logger.error({
            msg: 'failed to stringify json',
            source: 'utils.stringifyJsonOrFallback',
            err,
        });
    }
    return fallback;
};

const mutateString = <T extends string | handlebars.SafeString>(original: T, mutate: (str: string) => string): T => {
    const isSafeString = original instanceof handlebars.SafeString;
    const result = mutate(original.toString());

    if (isSafeString) return new handlebars.SafeString(result) as T;

    return result as T;
};

export const toKebabCase = <T extends string | handlebars.SafeString>(str: T): T => {
    return mutateString(str, (s) => {
        if (!s) return '';
        const match = s.match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g);
        if (match) {
            return match.join('-').toLowerCase();
        }
        return s;
    });
};

export const toPascalCase = <T extends string | handlebars.SafeString>(str: T): T => {
    return mutateString(str, (s) => {
        const words = s.toString().replace(/^\.\//, '').replace(/\W+/g, ' ').split(' ');
        const pascalWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

        return pascalWords.join('');
    });
};

export const toCamelCase = <T extends string | handlebars.SafeString>(str: T): T => {
    return mutateString(str, (s) => {
        const words = s.replace(/^\.\//, '').replace(/\W+/g, ' ').split(' ');
        const camelWords = words.map((word, index) => {
            if (index === 0) {
                return word.toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });

        return camelWords.join('');
    });
};
