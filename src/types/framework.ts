export interface CLDDimension {
    id: string;

    code: string;

    name: string;

    description: string;

    indicators: string[];

    questionEvidence: string[];

    version: string;

    status:
    | "active"
    | "deprecated";
}

export interface KBCDimension {
    id: string;

    code: string;

    name: string;

    description: string;

    indicators: string[];

    learningEvidence: string[];

    version: string;

    status:
    | "active"
    | "deprecated";
}

export interface FrameworkLibrary {
    frameworkId: string;

    name: string;

    version: string;

    dimensions:
    | CLDDimension[]
    | KBCDimension[];

    sourceReferenceIds:
    string[];

    status:
    | "active"
    | "draft"
    | "archived";
}
