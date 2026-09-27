import {
    describe,
    expect,
    it
} from "vitest";

import {
    QuestionValidationEngine
} from "../src/engine/validation.engine.js";

import type {
    Question
} from "../src/types/question.js";

const question: Question = {

    questionId:
        "TEST-Q-001",

    version: 1,

    status:
        "draft",

    phase:
        "B",

    grade:
        3,

    subject:
        "Al-Qur'an Hadis",

    element:
        "Al-Qur'an",

    curriculumId:
        "KM-MADRASAH",

    cpId:
        "CP-TEST",

    tpId:
        "TP-TEST",

    materialScope:
        "Surah Al-Fatihah",

    indicator:
        "Peserta didik mampu menerapkan makna ayat.",

    sklReferences: [
        "REG-PERMENDIKDASMEN-10-2025"
    ],

    contentStandardReferences: [
        "REG-PERMENDIKDASMEN-12-2025"
    ],

    assessment: {
        purpose:
            "formative",

        domains: [
            "knowledge"
        ],

        evidence:
            "Jawaban menunjukkan penerapan konsep."
    },

    cognitiveLevel:
        "C3",

    cld: [
        {
            dimension:
                "21CLD-KC",

            level:
                1,

            evidence:
                "Peserta didik menghubungkan konsep dengan situasi."
        }
    ],

    kbc: {
        primary:
            "KBC-C01",

        values: [
            "syukur"
        ],

        evidence:
            "Konteks soal mendorong rasa syukur."
    },

    questionType:
        "MCQ",

    stem:
        "Perilaku yang menunjukkan rasa syukur adalah ...",

    options: [
        {
            id: "A",
            text: "Bersyukur."
        },
        {
            id: "B",
            text: "Sombong."
        }
    ],

    answer:
        "A",

    explanation:
        "Bersyukur merupakan bentuk pengakuan terhadap nikmat.",

    difficulty:
        "easy",

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
        "2026-01-01T00:00:00.000Z",

    updatedAt:
        "2026-01-01T00:00:00.000Z"
};

describe(
    "QuestionValidationEngine",
    () => {

        it(
            "validates a structurally correct question",
            () => {

                const engine =
                    new QuestionValidationEngine();

                const result =
                    engine.validate(
                        question
                    );

                expect(
                    result.valid
                ).toBe(true);

                expect(
                    result.errors
                ).toHaveLength(0);
            }
        );

        it(
            "rejects MCQ without answer",
            () => {

                const engine =
                    new QuestionValidationEngine();

                const invalid = {
                    ...question,
                    answer: undefined
                };

                const result =
                    engine.validate(
                        invalid
                    );

                expect(
                    result.valid
                ).toBe(false);
            }
        );
    }
);
