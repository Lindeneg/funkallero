export const ensureStringArray = (properties?: string | string[]): string[] => {
    if (!properties) return [];
    if (typeof properties === 'string') return [properties];
    return properties;
};
