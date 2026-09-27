import path from "node:path";

import type {
    Question
} from "../types/question.js";

import {
    listJsonFiles,
    readJson,
    writeJson
} from "../utils/file.js";

interface LibraryQuestion {
    questionId: string;
    version: number;
    status: Question["status"];
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
    sklReferences?: string[];
    contentStandardReferences?: string[];
    assessment: Question["assessment"];
    cognitiveLevel: Question["cognitiveLevel"];
    cld?: Question["cld"];
    kbc?: Question["kbc"];
    stimulus?: Question["stimulus"];
    questionType: Question["questionType"];
    stem: string;
    options?: Question["options"];
    answer: Question["answer"];
    explanation?: string;
    difficulty?: Question["difficulty"];
    tags?: string[];
    sources?: Question["sources"];
    qualityControl: Question["qualityControl"];
    createdAt: string;
    updatedAt: string;
}

interface LibraryIndex {
    name: string;
    version: string;
    generatedAt: string;
    questionCount: number;
    paths: {
        allQuestions: string;
        questionById: string;
        subjects: string;
        metadata: string;
    };
    subjects: Array<{
        id: string;
        label: string;
        count: number;
        path: string;
    }>;
}

function slugify(value: string): string {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function loadQuestions(): Question[] {
    const root =
        path.resolve("data/questions");

    return listJsonFiles(root)
        .map(file =>
            readJson<Question>(file)
        );
}

function publicQuestion(
    question: Question
): LibraryQuestion {
    return {
        questionId:
            question.questionId,

        version:
            question.version,

        status:
            question.status,

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

        sklReferences:
            question.sklReferences,

        contentStandardReferences:
            question.contentStandardReferences,

        assessment:
            question.assessment,

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

        answer:
            question.answer,

        explanation:
            question.explanation,

        difficulty:
            question.difficulty,

        tags:
            question.tags,

        sources:
            question.sources,

        qualityControl:
            question.qualityControl,

        createdAt:
            question.createdAt,

        updatedAt:
            question.updatedAt
    };
}

export function generateLibrary(): void {
    const outputRoot =
        path.resolve("library");

    const questions =
        loadQuestions()
            .map(publicQuestion);

    questions.sort(
        (a, b) =>
            a.questionId.localeCompare(
                b.questionId
            )
    );

    const generatedAt =
        new Date().toISOString();

    const subjects =
        new Map<
            string,
            LibraryQuestion[]
        >();

    for (const question of questions) {
        const existing =
            subjects.get(
                question.subject
            ) ?? [];

        existing.push(question);

        subjects.set(
            question.subject,
            existing
        );
    }

    writeJson(
        path.join(
            outputRoot,
            "questions.json"
        ),
        questions
    );

    for (const question of questions) {
        writeJson(
            path.join(
                outputRoot,
                "questions",
                `${question.questionId}.json`
            ),
            question
        );
    }

    const subjectIndex: Array<{
        id: string;
        label: string;
        count: number;
        path: string;
    }> = [];

    for (
        const [
            subject,
            subjectQuestions
        ] of subjects
    ) {
        const id =
            slugify(subject);

        writeJson(
            path.join(
                outputRoot,
                "subjects",
                `${id}.json`
            ),
            subjectQuestions
        );

        subjectIndex.push({
            id,
            label: subject,
            count:
                subjectQuestions.length,
            path:
                `subjects/${id}.json`
        });
    }

    subjectIndex.sort(
        (a, b) =>
            a.label.localeCompare(
                b.label
            )
    );

    const metadata = {
        name:
            "QBank KBC × 21CLD",

        description:
            "Static educational question library for KBC and 21CLD.",

        formatVersion:
            "1.0.0",

        generatedAt,

        questionCount:
            questions.length,

        subjects:
            subjectIndex.length
    };

    writeJson(
        path.join(
            outputRoot,
            "metadata.json"
        ),
        metadata
    );

    const index: LibraryIndex = {
        name:
            "QBank KBC × 21CLD",

        version:
            "1.0.0",

        generatedAt,

        questionCount:
            questions.length,

        paths: {
            allQuestions:
                "questions.json",

            questionById:
                "questions/{questionId}.json",

            subjects:
                "subjects/{subject}.json",

            metadata:
                "metadata.json"
        },

        subjects:
            subjectIndex
    };

    writeJson(
        path.join(
            outputRoot,
            "index.json"
        ),
        index
    );

    console.log(
        [
            "",
            "Static library generated.",
            "",
            `Questions: ${questions.length}`,
            `Subjects: ${subjectIndex.length}`,
            `Output: ${outputRoot}`,
            ""
        ].join("\n")
    );
}
