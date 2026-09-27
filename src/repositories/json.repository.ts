import {
    listJsonFiles,
    readJson,
    writeJson
} from "../utils/file.js";

export class JsonRepository<T extends object> {
    constructor(
        protected readonly directory: string
    ) { }

    findAll(): T[] {
        return listJsonFiles(this.directory)
            .map((file) =>
                readJson<T>(file)
            );
    }

    protected readFile(
        filePath: string
    ): T {
        return readJson<T>(filePath);
    }

    protected writeFile(
        filePath: string,
        data: T
    ): void {
        writeJson(
            filePath,
            data
        );
    }
}
