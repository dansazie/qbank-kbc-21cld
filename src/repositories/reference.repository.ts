import type {
    ReferenceDocument
} from "../types/reference.js";

export class ReferenceRepository {

    private readonly references:
        ReferenceDocument[];

    constructor(
        references:
            ReferenceDocument[] = []
    ) {
        this.references = [
            ...references
        ];
    }

    getAll(): ReferenceDocument[] {
        return [
            ...this.references
        ];
    }

    getById(
        referenceId: string
    ): ReferenceDocument | undefined {

        return this.references.find(
            reference =>
                reference.referenceId ===
                referenceId
        );
    }

    findByType(
        type: ReferenceDocument["type"]
    ): ReferenceDocument[] {

        return this.references.filter(
            reference =>
                reference.type === type
        );
    }

    findActive(): ReferenceDocument[] {

        return this.references.filter(
            reference =>
                reference.status ===
                "active"
        );
    }

    add(
        reference: ReferenceDocument
    ): void {

        const exists =
            this.getById(
                reference.referenceId
            );

        if (exists) {

            throw new Error(
                `Reference ${reference.referenceId} already exists.`
            );
        }

        this.references.push(
            reference
        );
    }
}
