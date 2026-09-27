import {
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    writeFileSync
} from "node:fs";

import path from "node:path";

export function ensureDirectory(dir: string): void {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
}

export function readJson<T>(filePath: string): T {
    return JSON.parse(
        readFileSync(filePath, "utf8")
    ) as T;
}

export function writeJson<T>(
    filePath: string,
    data: T
): void {
    ensureDirectory(path.dirname(filePath));

    writeFileSync(
        filePath,
        JSON.stringify(data, null, 2),
        "utf8"
    );
}

/**
 * Membaca seluruh file JSON secara recursive.
 *
 * Contoh:
 *
 * data/questions/
 * ├── draft/
 * │   └── soal-001.json
 * ├── review/
 * │   └── soal-002.json
 * └── published/
 *     └── soal-003.json
 *
 * semuanya akan ditemukan.
 */
export function listJsonFiles(
    dir: string
): string[] {

    if (!existsSync(dir)) {
        return [];
    }

    const result: string[] = [];

    function walk(currentDir: string): void {

        const entries = readdirSync(
            currentDir,
            { withFileTypes: true }
        );

        for (const entry of entries) {

            const fullPath = path.join(
                currentDir,
                entry.name
            );

            if (entry.isDirectory()) {
                walk(fullPath);
                continue;
            }

            if (
                entry.isFile() &&
                entry.name.toLowerCase().endsWith(".json")
            ) {
                result.push(fullPath);
            }
        }
    }

    walk(dir);

    return result;
}
