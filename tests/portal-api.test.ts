import {
    describe,
    expect,
    it
} from "vitest";

import {
    buildPortalWorksheet
} from "../src/api/portal.api.js";

import type {
    Question
} from "../src/types/question.js";

function makeQuestion(
    id: string
): Question {

    return {
        questionId: id,
        version: 1,
        status: "published",
        phase: "B",
        grade: 3,
        subject: "Al-Qur'an Hadis",
        element: "Al-Qur'an",
        curriculumId: "KM-MADRASAH",
        cpId: "CP-TEST",
        cpText: "CP test",
        tpId: "TP-TEST",
        tpText: "TP test",
        materialScope: "Surah Al-Fatihah",
        indicator: "Indikator test",
        sklReferences: [],
        contentStandardReferences: [],

        assessment: {
            purpose: "formative",
            domains: ["knowledge"],
            evidence: "Evidence test"
        },

        cognitiveLevel: "C3",

        cld: [
            {
                dimension: "21CLD-KC",
                level: 1,
                evidence: "Evidence CLD"
            }
        ],

        kbc: {
            primary: "KBC-C01",
            values: ["syukur"],
            evidence: "Evidence KBC"
        },

        questionType: "MCQ",

        stem:
            `Soal ${id}`,

        options: [
            {
                id: "A",
                text: "Pilihan A"
            },
            {
                id: "B",
                text: "Pilihan B"
            }
        ],

        answer: "B",

        explanation:
            "Penjelasan jawaban.",

        difficulty: "easy",

        tags: ["portal-test"],

        qualityControl: {
            contentValidity: "pending",
            constructValidity: "pending",
            languageQuality: "pending",
            biasCheck: "pending"
        },

        createdAt:
            "2026-01-01T00:00:00.000Z",

        updatedAt:
            "2026-01-01T00:00:00.000Z"
    };
}

describe(
    "Portal API",
    () => {

        it(
            "builds a student-safe worksheet from QBank",
            () => {

                const result =
                    buildPortalWorksheet(
                        [
                            makeQuestion("Q1"),
                            makeQuestion("Q2")
                        ],
                        {
                            worksheetId:
                                "PORTAL-TEST-001",

                            title:
                                "Latihan Portal",

                            instructions:
                                "Kerjakan dengan teliti.",

                            blueprint: {
                                count: 2,

                                phase: "B",

                                grade: 3,

                                subject:
                                    "Al-Qur'an Hadis",

                                cognitive: {
                                    C3: 2
                                },

                                questionTypes: {
                                    MCQ: 2
                                },

                                difficulty: {
                                    easy: 2
                                },

                                cld: {
                                    "21CLD-KC": 2
                                },

                                kbc: {
                                    "KBC-C01": 2
                                },

                                randomize: false
                            }
                        }
                    );

                expect(
                    result.blueprint.complete
                ).toBe(true);

                expect(
                    result.blueprint.selected
                ).toBe(2);

                expect(
                    result.worksheet.worksheetId
                ).toBe(
                    "PORTAL-TEST-001"
                );

                expect(
                    result.worksheet.questions
                ).toHaveLength(2);

                expect(
                    result.worksheet.questions[0]
                        .questionId
                ).toBe("Q1");

                expect(
                    result.worksheet.questions[1]
                        .questionId
                ).toBe("Q2");

                expect(
                    result.worksheet.questions[0]
                ).not.toHaveProperty(
                    "answer"
                );

                expect(
                    result.worksheet.questions[0]
                ).not.toHaveProperty(
                    "explanation"
                );
            }
        );

    }
);
