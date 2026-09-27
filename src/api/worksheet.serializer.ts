import type {
    Question,
    QuestionOption
} from "../types/question.js";

export interface WorksheetQuestion {
    questionId: string;

    number: number;

    phase: Question["phase"];

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

    cognitiveLevel:
    Question["cognitiveLevel"];

    cld:
    Question["cld"];

    kbc:
    Question["kbc"];

    stimulus:
    Question["stimulus"];

    questionType:
    Question["questionType"];

    stem: string;

    options?:
    QuestionOption[];

    difficulty:
    Question["difficulty"];

    tags:
    string[];
}

export interface WorksheetPackage {
    worksheetId: string;

    title: string;

    generatedAt: string;

    instructions?: string;

    questions:
    WorksheetQuestion[];
}

export interface AnswerKeyItem {
    questionId: string;

    answer:
    NonNullable<
        Question["answer"]
    >;

    explanation?: string;

    rubric:
    Question["rubric"];
}

export interface AnswerKeyPackage {
    worksheetId: string;

    generatedAt: string;

    answers:
    AnswerKeyItem[];
}

export function serializeWorksheet(
    questions: Question[],
    options?: {
        worksheetId?: string;
        title?: string;
        instructions?: string;
    }
): WorksheetPackage {

    return {

        worksheetId:
            options?.worksheetId ??
            generateWorksheetId(),

        title:
            options?.title ??
            "Lembar Kerja Peserta Didik",

        generatedAt:
            new Date().toISOString(),

        ...(options?.instructions
            ? {
                instructions:
                    options.instructions
            }
            : {}),

        questions:
            questions.map(
                (
                    question,
                    index
                ) => ({

                    questionId:
                        question.questionId,

                    number:
                        index + 1,

                    phase:
                        question.phase,

                    grade:
                        question.grade,

                    subject:
                        question.subject,

                    element:
                        question.element,

                    curriculumId:
                        question.curriculumId,

                    cpId:
                        question.cpId,

                    cpText:
                        question.cpText,

                    tpId:
                        question.tpId,

                    tpText:
                        question.tpText,

                    materialScope:
                        question.materialScope,

                    indicator:
                        question.indicator,

                    cognitiveLevel:
                        question.cognitiveLevel,

                    cld:
                        question.cld,

                    kbc:
                        question.kbc,

                    stimulus:
                        question.stimulus,

                    questionType:
                        question.questionType,

                    stem:
                        question.stem,

                    options:
                        question.options,

                    difficulty:
                        question.difficulty,

                    tags:
                        question.tags ?? []
                })
            )
    };
}

export function serializeAnswerKey(
    worksheetId: string,
    questions: Question[]
): AnswerKeyPackage {

    return {

        worksheetId,

        generatedAt:
            new Date().toISOString(),

        answers:
            questions.map(
                question => {

                    if (
                        question.answer ===
                        undefined
                    ) {

                        throw new Error(
                            `Question '${question.questionId}' tidak memiliki answer.`
                        );
                    }

                    return {

                        questionId:
                            question.questionId,

                        answer:
                            question.answer,

                        explanation:
                            question.explanation,

                        rubric:
                            question.rubric
                    };
                }
            )
    };
}

function generateWorksheetId():
    string {

    const timestamp =
        Date.now()
            .toString(36)
            .toUpperCase();

    return `LKPD-${timestamp}`;
}
