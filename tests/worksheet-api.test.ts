import {
    describe,
    expect,
    it
} from "vitest";

import {
    serializeWorksheet,
    serializeAnswerKey
} from "../src/api/worksheet.serializer.js";

import type {
    Question
} from "../src/types/question.js";

function makeQuestion(
    id: string
): Question {

    return {
        questionId:
            id,

        version:
            1,

        status:
            "published",

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

        cpText:
            "CP test",

        tpId:
            "TP-TEST",

        tpText:
            "TP test",

        materialScope:
            "Surah Al-Fatihah",

        indicator:
            "Indikator test",

        sklReferences:
            [],

        contentStandardReferences:
            [],

        assessment: {
            purpose:
                "formative",

            domains: [
                "knowledge"
            ],

            evidence:
                "Evidence test"
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
                    "Evidence CLD"
            }
        ],

        kbc: {
            primary:
                "KBC-C01",

            values: [
                "syukur"
            ],

            evidence:
                "Evidence KBC"
        },

        questionType:
            "MCQ",

        stem:
            `Soal ${id}`,

        options: [
            {
                id:
                    "A",

                text:
                    "Pilihan A"
            },
            {
                id:
                    "B",

                text:
                    "Pilihan B"
            }
        ],

        answer:
            "B",

        explanation:
            "Penjelasan rahasia untuk guru.",

        difficulty:
            "easy",

        tags:
            [
                "test"
            ],

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
}

describe(
    "Worksheet API contract",
    () => {

        it(
            "creates a student-safe worksheet",
            () => {

                const worksheet =
                    serializeWorksheet(
                        [
                            makeQuestion(
                                "Q1"
                            )
                        ],
                        {
                            worksheetId:
                                "PORTAL-TEST-001",

                            title:
                                "Latihan Portal",

                            instructions:
                                "Pilih jawaban yang benar."
                        }
                    );

                expect(
                    worksheet.worksheetId
                ).toBe(
                    "PORTAL-TEST-001"
                );

                expect(
                    worksheet.title
                ).toBe(
                    "Latihan Portal"
                );

                expect(
                    worksheet.instructions
                ).toBe(
                    "Pilih jawaban yang benar."
                );

                expect(
                    worksheet.questions
                ).toHaveLength(
                    1
                );

                const question =
                    worksheet.questions[0];

                expect(
                    question.questionId
                ).toBe(
                    "Q1"
                );

                expect(
                    question.number
                ).toBe(
                    1
                );

                expect(
                    question.phase
                ).toBe(
                    "B"
                );

                expect(
                    question.grade
                ).toBe(
                    3
                );

                expect(
                    question.subject
                ).toBe(
                    "Al-Qur'an Hadis"
                );

                expect(
                    question.curriculumId
                ).toBe(
                    "KM-MADRASAH"
                );

                expect(
                    question.cognitiveLevel
                ).toBe(
                    "C3"
                );

                expect(
                    question.cld
                ).toEqual([
                    {
                        dimension:
                            "21CLD-KC",

                        level:
                            1,

                        evidence:
                            "Evidence CLD"
                    }
                ]);

                expect(
                    question.kbc
                ).toEqual({
                    primary:
                        "KBC-C01",

                    values: [
                        "syukur"
                    ],

                    evidence:
                        "Evidence KBC"
                });

                expect(
                    question
                ).not.toHaveProperty(
                    "answer"
                );

                expect(
                    question
                ).not.toHaveProperty(
                    "explanation"
                );

                expect(
                    question
                ).not.toHaveProperty(
                    "rubric"
                );
            }
        );

        it(
            "keeps answer data available only to answer-key serialization",
            () => {

                const questions = [
                    makeQuestion(
                        "Q1"
                    )
                ];

                const worksheet =
                    serializeWorksheet(
                        questions
                    );

                const answerKey =
                    serializeAnswerKey(
                        worksheet.worksheetId,
                        questions
                    );

                expect(
                    answerKey.answers
                ).toHaveLength(
                    1
                );

                expect(
                    answerKey.answers[0]
                ).toMatchObject({
                    questionId:
                        "Q1",

                    answer:
                        "B",

                    explanation:
                        "Penjelasan rahasia untuk guru."
                });
            }
        );

    }
);
