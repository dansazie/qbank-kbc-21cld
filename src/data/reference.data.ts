import type {
    ReferenceDocument
} from "../types/reference.js";

import references from "../../data/references/references.json" with {
    type: "json"
};

export const referenceData:
    ReferenceDocument[] =
    references as ReferenceDocument[];
