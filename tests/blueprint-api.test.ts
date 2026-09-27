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

describe(
    "Blueprint API contract",
    () => {

        const question:
            Question = {
            questionId:
                "TEST-BLUEPRINT-001",

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
                "Soal test?",

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

            difficulty:
                "easy",

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

        it(
            "generates blueprint result",
            () => {

                const engine =
                    new BlueprintEngineV2();

                const result =
                    engine.build(
                        [question],
                        {
                            blueprintId:
                                "BP-TEST-001",

                            count:
                                1,

                            phase:
                                "B",

                            grade:
                                3,

                            subject:
                                "Al-Qur'an Hadis",

                            cognitive: {
                                C3:
                                    1
                            },

                            questionTypes: {
                                MCQ:
                                    1
                            },

                            difficulty: {
                                easy:
                                    1
                            },

                            cld: {
                                "21CLD-KC":
                                    1
                            },

                            kbc: {
                                "KBC-C01":
                                    1
                            }
                        }
                    );

                expect(
                    result.selected
                ).toHaveLength(
                    1
                );

                expect(
                    result.complete
                ).toBe(
                    true
                );

                expect(
                    result.fulfilled.total
                ).toBe(
                    1
                );

                expect(
                    result.fulfilled.cognitive.C3
                ).toBe(
                    1
                );

                expect(
                    result.fulfilled.questionTypes.MCQ
                ).toBe(
                    1
                );

                expect(
                    result.fulfilled.difficulty.easy
                ).toBe(
                    1
                );

                expect(
                    result.fulfilled.cld[
                    "21CLD-KC"
                    ]
                ).toBe(
                    1
                );

                expect(
                    result.fulfilled.kbc[
                    "KBC-C01"
                    ]
                ).toBe(
                    1
                );

                expect(
                    result.shortages
                ).toHaveLength(
                    0
                );
            }
        );

        it(
            "reports shortages",
            () => {

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
    }
);
