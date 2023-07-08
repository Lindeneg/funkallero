const s: Record<'args', string[]> = {
    args: [],
};

const state = {
    get: () => Object.freeze(s.args),
    set: (args: string[]) => (s.args = args),
};

export default state;
