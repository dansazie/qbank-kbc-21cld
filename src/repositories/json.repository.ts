import {
    listJsonFiles,
    readJson
} from "../utils/file.js";

export class JsonRepository<T extends object> {
    constructor(
        private readonly directory: string
    ) { }

    findAll(): T[] {
        return listJsonFiles(this.directory)
            .map((file) => readJson<T>(file));
    }
}
