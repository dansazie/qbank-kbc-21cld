import type {
    ReferenceDocument,
    ReferenceType
} from "../types/reference.js";

import {
    ReferenceRepository
} from "../repositories/reference.repository.js";

export class ReferenceService {

    constructor(
        private readonly repository:
            ReferenceRepository
    ) { }

    getAll(): ReferenceDocument[] {

        return this.repository.getAll();
    }

    getById(
        referenceId: string
    ): ReferenceDocument | undefined {

        return this.repository.getById(
            referenceId
        );
    }

    findByType(
        type: ReferenceType
    ): ReferenceDocument[] {

        return this.repository.findByType(
            type
        );
    }

    active(): ReferenceDocument[] {

        return this.repository.findActive();
    }
}
