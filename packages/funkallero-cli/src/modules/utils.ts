import { readFile, writeFile } from 'fs/promises';
import { joinPath } from '@lindeneg/scaffold-core';

export const readFileAndFindLastIndexOfRegex = async (rootDir: string, filename: string, regex: RegExp) => {
    const path = joinPath(rootDir, filename);
    const fileContents = await readFile(path, { encoding: 'utf8' });
    const matches = [...fileContents.matchAll(regex)];
    const matchesMinusOne = matches.length - 1;
    const lastMatchIndex = matches.length > 0 ? matches[matchesMinusOne].index : -1;

    const write = async (newContents: string) => {
        await writeFile(path, newContents, { encoding: 'utf8' });
    };

    return {
        write,
        matches,
        fileContents,
        matchesMinusOne,
        lastMatchIndex,
    };
};
