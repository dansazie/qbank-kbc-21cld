import {
    FrameworkRepository
} from "../data/framework.repository.js";

export class FrameworkService {

    constructor(
        private readonly repository:
            FrameworkRepository
    ) { }

    getAll() {

        return this.repository.getAll();
    }

    getById(
        frameworkId: string
    ) {

        return this.repository.getById(
            frameworkId
        );
    }

    getCLD() {

        return this.repository.getCLD();
    }

    getKBC() {

        return this.repository.getKBC();
    }
}
