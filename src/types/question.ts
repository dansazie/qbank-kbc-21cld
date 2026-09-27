import type { PhaseId } from "./curriculum.js";

export type QuestionStatus =
    | "draft"
    | "review"
    | "validated"
    | "published"
    | "archived";

export type QuestionType =
    | "MCQ"
    | "MCMA"
    | "TRUE_FALSE"
    | "MATCHING"
    | "SHORT_ANSWER"
    | "ESSAY"
    | "PERFORMANCE"
    | "PROJECT";

export type CognitiveLevel =
    | "C1"
    | "C2"
    | "C3"
    | "C4"
    | "C5"
    | "C6";

export interface QuestionOption {
    id: string;
    text: string;
}

export interface QuestionSource {
    sourceId: string;
    reference: string;
    locator?: string;
}

export interface Stimulus {
    type:
    | "text"
    | "image"
    | "table"
    | "chart"
    | "case"
    | "scenario"
    | "quran"
    | "hadith"
    | "data"
    | "multimedia";

    content?: string;
    source?: QuestionSource;
}

export interface CLDMapping {
    dimension: string;
    level?: number;
    evidence: string;
}

export interface KBCMapping {
    primary?: string;
    secondary?: string[];
    values?: string[];
    evidence: string;
}

export interface AssessmentMapping {
    purpose: "diagnostic" | "formative" | "summative";
    domains: Array<"knowledge" | "skill" | "attitude">;
    evidence: string;
}

export interface QualityControl {
    contentValidity: "pending" | "pass" | "fail";
    constructValidity: "pending" | "pass" | "fail";
    languageQuality: "pending" | "pass" | "fail";
    biasCheck: "pending" | "pass" | "fail";
    reviewer?: string;
    notes?: string[];
}

export interface RubricItem {
    score: number;
    description: string;
}

export interface Question {
    questionId: string;
    version: number;
    status: QuestionStatus;

    phase: PhaseId;
    grade?: number;

    subject: string;
    element: string;

    curriculumId?: string;
    cpId?: string;
    cpText?: string;
    tpId?: string;
    tpText?: string;

    materialScope: string;
    indicator: string;

    sklReferences: string[];
    contentStandardReferences: string[];

    assessment: AssessmentMapping;

    cognitiveLevel: CognitiveLevel;

    cld?: CLDMapping[];
    kbc?: KBCMapping;

    stimulus?: Stimulus;

    questionType: QuestionType;

    stem: string;

    options?: QuestionOption[];

    answer?: string | string[];

    explanation?: string;

    rubric?: RubricItem[];

    difficulty?: "easy" | "medium" | "hard";

    tags?: string[];

    sources?: QuestionSource[];

    qualityControl: QualityControl;

    createdAt: string;
    updatedAt: string;
}
