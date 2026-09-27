import {
    describe,
    expect,
    it
} from "vitest";

import {
    BlueprintEngineV2
} from "../src/engine/blueprint.engine.v2.js";

import type {
    Question
} from "../src/types/question.js";

import {
    serializeAnswerKey,
    serializeWorksheet
} from "../src/api/worksheet.serializer.js";

function makeQuestion(
    id: string,
    cognitiveLevel:
        Question["cognitiveLevel"],
    difficulty:
        NonNullable<
            Question["difficulty"]
        > = "easy"
): Question {

    return {
        questionId:
            id,

        version: 1,

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

        cognitiveLevel,

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
            "Penjelasan",

        difficulty,

        tags:
            ["test"],

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
    "Blueprint API contract",
    () => {

        it(
            "preserves curriculum, 21CLD, and KBC metadata in worksheet",
            () => {

                const questions = [
                    makeQuestion(
                        "Q-METADATA",
                        "C4",
                        "medium"
                    )
                ];

                const worksheet =
                    serializeWorksheet(
                        questions,
                        {
                            worksheetId:
                                "LKPD-METADATA-001"
                        }
                    );

                const question =
                    worksheet.questions[0];

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
                    question.element
                ).toBe(
                    "Al-Qur'an"
                );

                expect(
                    question.materialScope
                ).toBe(
                    "Surah Al-Fatihah"
                );

                expect(
                    question.curriculumId
                ).toBe(
                    "KM-MADRASAH"
                );

                expect(
                    question.cpId
                ).toBe(
                    "CP-TEST"
                );

                expect(
                    question.cpText
                ).toBe(
                    "CP test"
                );

                expect(
                    question.tpId
                ).toBe(
                    "TP-TEST"
                );

                expect(
                    question.tpText
                ).toBe(
                    "TP test"
                );

                expect(
                    question.cognitiveLevel
                ).toBe(
                    "C4"
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
            }
        );


        it(
            "serializes a student worksheet without answer or explanation",
            () => {

                const questions = [
                    makeQuestion(
                        "Q1",
                        "C3",
                        "easy"
                    )
                ];

                const worksheet =
                    serializeWorksheet(
                        questions,
                        {
                            worksheetId:
                                "LKPD-TEST-001",

                            title:
                                "LKPD Al-Qur'an Hadis",

                            instructions:
                                "Kerjakan dengan teliti."
                        }
                    );

                expect(
                    worksheet.worksheetId
                ).toBe(
                    "LKPD-TEST-001"
                );

                expect(
                    worksheet.title
                ).toBe(
                    "LKPD Al-Qur'an Hadis"
                );

                expect(
                    worksheet.instructions
                ).toBe(
                    "Kerjakan dengan teliti."
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
                    question.stem
                ).toBe(
                    "Soal Q1"
                );

                expect(
                    question.options
                ).toHaveLength(
                    2
                );

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
            "keeps answer and explanation available only in answer key serialization",
            () => {

                const questions = [
                    makeQuestion(
                        "Q1",
                        "C3",
                        "easy"
                    )
                ];

                const answerKey =
                    serializeAnswerKey(
                        "LKPD-TEST-001",
                        questions
                    );

                expect(
                    answerKey.worksheetId
                ).toBe(
                    "LKPD-TEST-001"
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
                        "Penjelasan"
                });
            }
        );

        it(
            "generates a complete blueprint with all requested distributions",
            () => {

                const questions = [
                    makeQuestion(
                        "Q1",
                        "C3",
                        "easy"
                    ),

                    makeQuestion(
                        "Q2",
                        "C3",
                        "easy"
                    ),

                    makeQuestion(
                        "Q3",
                        "C4",
                        "medium"
                    ),

                    makeQuestion(
                        "Q4",
                        "C4",
                        "medium"
                    )
                ];

                const engine =
                    new BlueprintEngineV2();

                const result =
                    engine.build(
                        questions,
                        {
                            blueprintId:
                                "BP-TEST-001",

                            count:
                                4,

                            phase:
                                "B",

                            grade:
                                3,

                            subject:
                                "Al-Qur'an Hadis",

                            cognitive: {
                                C3:
                                    2,

                                C4:
                                    2
                            },

                            questionTypes: {
                                MCQ:
                                    4
                            },

                            difficulty: {
                                easy:
                                    2,

                                medium:
                                    2
                            },

                            cld: {
                                "21CLD-KC":
                                    4
                            },

                            kbc: {
                                "KBC-C01":
                                    4
                            }
                        }
                    );

                expect(
                    result.selected
                ).toHaveLength(
                    4
                );

                expect(
                    result.complete
                ).toBe(
                    true
                );

                expect(
                    result.shortages
                ).toHaveLength(
                    0
                );

                expect(
                    result.fulfilled.total
                ).toBe(
                    4
                );

                expect(
                    result.fulfilled.cognitive.C3
                ).toBe(
                    2
                );

                expect(
                    result.fulfilled.cognitive.C4
                ).toBe(
                    2
                );

                expect(
                    result.fulfilled.questionTypes.MCQ
                ).toBe(
                    4
                );

                expect(
                    result.fulfilled.difficulty.easy
                ).toBe(
                    2
                );

                expect(
                    result.fulfilled.difficulty.medium
                ).toBe(
                    2
                );

                expect(
                    result.fulfilled.cld[
                    "21CLD-KC"
                    ]
                ).toBe(
                    4
                );

                expect(
                    result.fulfilled.kbc[
                    "KBC-C01"
                    ]
                ).toBe(
                    4
                );
            }
        );

        it(
            "reports shortages when the requested blueprint cannot be fulfilled",
            () => {

                const question =
                    makeQuestion(
                        "Q1",
                        "C3",
                        "easy"
                    );

                const engine =
                    new BlueprintEngineV2();

                const result =
                    engine.build(
                        [question],
                        {
                            count:
                                10,

                            phase:
                                "B",

                            grade:
                                3,

                            subject:
                                "Al-Qur'an Hadis",

                            cognitive: {
                                C3:
                                    5
                            },

                            questionTypes: {
                                MCQ:
                                    5
                            }
                        }
                    );

                expect(
                    result.complete
                ).toBe(
                    false
                );

                expect(
                    result.selected
                ).toHaveLength(
                    1
                );

                expect(
                    result.shortages.length
                ).toBeGreaterThan(
                    0
                );

                expect(
                    result.warnings.length
                ).toBeGreaterThan(
                    0
                );
            }
        );

        it(
            "produces the same selection order with the same seed",
            () => {

                const questions = [
                    makeQuestion(
                        "Q1",
                        "C3"
                    ),

                    makeQuestion(
                        "Q2",
                        "C3"
                    ),

                    makeQuestion(
                        "Q3",
                        "C4"
                    ),

                    makeQuestion(
                        "Q4",
                        "C4"
                    )
                ];

                const engine =
                    new BlueprintEngineV2();

                const blueprint = {
                    count:
                        4,

                    phase:
                        "B",

                    grade:
                        3,

                    subject:
                        "Al-Qur'an Hadis",

                    randomize:
                        true,

                    seed:
                        "seed-2026"
                };

                const first =
                    engine.build(
                        questions,
                        blueprint
                    );

                const second =
                    engine.build(
                        questions,
                        blueprint
                    );

                expect(
                    first.selected.map(
                        question =>
                            question.questionId
                    )
                ).toEqual(
                    second.selected.map(
                        question =>
                            question.questionId
                    )
                );
            }
        );

        it(
            "supports non-randomized selection",
            () => {

                const questions = [
                    makeQuestion(
                        "Q1",
                        "C3"
                    ),

                    makeQuestion(
                        "Q2",
                        "C3"
                    ),

                    makeQuestion(
                        "Q3",
                        "C4"
                    )
                ];

                const engine =
                    new BlueprintEngineV2();

                const result =
                    engine.build(
                        questions,
                        {
                            count:
                                3,

                            phase:
                                "B",

                            grade:
                                3,

                            subject:
                                "Al-Qur'an Hadis",

                            randomize:
                                false
                        }
                    );

                expect(
                    result.selected.map(
                        question =>
                            question.questionId
                    )
                ).toEqual([
                    "Q1",
                    "Q2",
                    "Q3"
                ]);
            }
        );

        it(
            "rejects distributions exceeding the requested count",
            () => {

                const engine =
                    new BlueprintEngineV2();

                expect(
                    () =>
                        engine.build(
                            [
                                makeQuestion(
                                    "Q1",
                                    "C3"
                                )
                            ],
                            {
                                count:
                                    2,

                                cognitive: {
                                    C3:
                                        3
                                }
                            }
                        )
                ).toThrow(
                    "Total distribution 'cognitive' (3) tidak boleh melebihi count (2)."
                );
            }
        );

        it(
            "does not modify the original question pool when randomizing",
            () => {

                const questions = [
                    makeQuestion(
                        "Q1",
                        "C3"
                    ),

                    makeQuestion(
                        "Q2",
                        "C3"
                    ),

                    makeQuestion(
                        "Q3",
                        "C4"
                    ),

                    makeQuestion(
                        "Q4",
                        "C4"
                    )
                ];

                const originalIds =
                    questions.map(
                        question =>
                            question.questionId
                    );

                const engine =
                    new BlueprintEngineV2();

                engine.build(
                    questions,
                    {
                        count:
                            4,

                        randomize:
                            true,

                        seed:
                            "immutable-pool-test"
                    }
                );

                expect(
                    questions.map(
                        question =>
                            question.questionId
                    )
                ).toEqual(
                    originalIds
                );
            }
        );
    }
);
