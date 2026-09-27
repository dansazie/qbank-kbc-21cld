import type {
    Question,
    QuestionOption,
    QuestionType,
    Stimulus
} from "../types/question.js";

import type {
    PhaseId
} from "../types/curriculum.js";

export interface QuestionGenerationInput {
    phase: PhaseId;
    grade: number;
    subject: string;
    element: string;

    curriculumId: string;
    cpId: string;
    cpText: string;

    tpId: string;
    tpText: string;

    materialScope: string;
    indicator: string;

    cognitiveLevel:
    | "C1"
    | "C2"
    | "C3"
    | "C4"
    | "C5"
    | "C6";

    cldDimension: string;
    cldLevel: number;
    cldEvidence: string;

    kbcPrimary: string;
    kbcValues: string[];
    kbcEvidence: string;

    questionType?: QuestionType;

    stem: string;
    options?: QuestionOption[];
    answer?: string | string[];

    explanation?: string;
    difficulty:
    | "easy"
    | "medium"
    | "hard";

    tags: string[];

    stimulusType?: Stimulus["type"];
    stimulusContent?: string;

    sourceId?: string;
    sourceReference?: string;
    sourceLocator?: string;
}

export class QuestionGenerator {

    generate(
        input: QuestionGenerationInput
    ): Question {

        const now =
            new Date().toISOString();

        const questionType =
            input.questionType ??
            "MCQ";

        const source =
            input.sourceId ||
                input.sourceReference ||
                input.sourceLocator
                ? {
                    sourceId:
                        input.sourceId ??
                        "",

                    reference:
                        input.sourceReference ??
                        "",

                    ...(input.sourceLocator
                        ? {
                            locator:
                                input.sourceLocator
                        }
                        : {})
                }
                : undefined;

        const stimulus:
            Stimulus | undefined =
            input.stimulusType ||
                input.stimulusContent ||
                source
                ? {
                    type:
                        input.stimulusType ??
                        "text",

                    content:
                        input.stimulusContent ??
                        input.materialScope,

                    ...(source
                        ? {
                            source
                        }
                        : {})
                }
                : undefined;

        return {
            questionId:
                this.generateId(
                    input.subject,
                    input.materialScope
                ),

            version: 1,

            status: "draft",

            phase:
                input.phase,

            grade:
                input.grade,

            subject:
                input.subject,

            element:
                input.element,

            curriculumId:
                input.curriculumId,

            cpId:
                input.cpId,

            cpText:
                input.cpText,

            tpId:
                input.tpId,

            tpText:
                input.tpText,

            materialScope:
                input.materialScope,

            indicator:
                input.indicator,

            sklReferences: [],

            contentStandardReferences: [],

            assessment: {
                purpose:
                    "formative",

                domains: [
                    "knowledge"
                ],

                evidence:
                    input.indicator
            },

            cognitiveLevel:
                input.cognitiveLevel,

            cld: [
                {
                    dimension:
                        input.cldDimension,

                    level:
                        input.cldLevel,

                    evidence:
                        input.cldEvidence
                }
            ],

            kbc: {
                primary:
                    input.kbcPrimary,

                values:
                    input.kbcValues,

                evidence:
                    input.kbcEvidence
            },

            ...(stimulus
                ? {
                    stimulus
                }
                : {}),

            questionType,

            stem:
                input.stem,

            ...(input.options
                ? {
                    options:
                        input.options
                }
                : {}),

            ...(input.answer !== undefined
                ? {
                    answer:
                        input.answer
                }
                : {}),

            ...(input.explanation
                ? {
                    explanation:
                        input.explanation
                }
                : {}),

            difficulty:
                input.difficulty,

            tags:
                input.tags,

            ...(source
                ? {
                    sources: [
                        source
                    ]
                }
                : {}),

            qualityControl: {
                contentValidity:
                    "pending",

                constructValidity:
                    "pending",

                languageQuality:
                    "pending",

                biasCheck:
                    "pending"
            },

            createdAt:
                now,

            updatedAt:
                now
        };
    }

    private generateId(
        subject: string,
        materialScope: string
    ): string {

        const subjectCode =
            subject
                .replace(
                    /[^A-Za-z0-9]+/g,
                    "-"
                )
                .replace(
                    /^-|-$/g,
                    ""
                )
                .toUpperCase()
                .slice(0, 12);

        const materialCode =
            materialScope
                .replace(
                    /[^A-Za-z0-9]+/g,
                    "-"
                )
                .replace(
                    /^-|-$/g,
                    ""
                )
                .toUpperCase()
                .slice(0, 12);

        const random =
            Date.now()
                .toString(36)
                .toUpperCase();

        return `${subjectCode}-${materialCode}-${random}`;
    }
}
