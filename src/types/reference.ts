export type ReferenceType =
    | "REGULATION"
    | "STANDARD"
    | "CURRICULUM"
    | "GUIDELINE"
    | "FRAMEWORK"
    | "ASSESSMENT";

export interface ReferenceVersion {
    version: string;
    effectiveFrom?: string;
    effectiveUntil?: string;
    status:
    | "active"
    | "superseded"
    | "draft";
}

export interface ReferenceDocument {
    referenceId: string;

    type: ReferenceType;

    title: string;

    issuer: string;

    jurisdiction?: string;

    description?: string;

    versions: ReferenceVersion[];

    currentVersion: string;

    source?: {
        title?: string;
        url?: string;
        publisher?: string;
        accessedAt?: string;
    };

    tags?: string[];

    status:
    | "active"
    | "archived"
    | "draft";
}
