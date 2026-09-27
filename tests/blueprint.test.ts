import {
    describe,
    expect,
    it
} from "vitest";

import {
    BlueprintEngine
} from "../src/engine/blueprint.engine.js";

import type {
    Question
} from "../src/types/question.js";

function makeQuestion(
    id: string,
    cognitiveLevel:
        Question["cognitiveLevel"]
): Question {

    return {
        questionId: id,
        version: 1,
        status: "validated",

        phase: "B",
        grade: 3,

        subject: "Al-Qur'an Hadis",
        element: "Al-Qur'an",

        cpId: "CP-TEST",
        tpId: "TP-TEST",

        materialScope: "Test",
        indicator: "Test",

        sklReferences: [],
        contentStandardReferences: [],

        assessment: {
            purpose: "formative",
            domains: ["knowledge"],
            evidence: "Test"
        },

        cognitiveLevel,

        cld: [
            {
                dimension: "21CLD-KC",
                evidence: "Test"
            }
        ],

        kbc: {
            primary: "KBC-C01",
            evidence: "Test"
        },

        questionType: "MCQ",

        stem: `Question ${id}`,

        options: [
            {
                id: "A",
                text: "Answer"
            },
            {
                id: "B",
                text: "Wrong"
            }
        ],

        answer: "A",

        difficulty: "medium",

        qualityControl: {
            contentValidity: "pass",
            constructValidity: "pass",
            languageQuality: "pass",
            biasCheck: "pass"
        },

        createdAt:
            "2026-01-01T00:00:00.000Z",

        updatedAt:
            "2026-01-01T00:00:00.000Z"
    };
}

describe(
    "BlueprintEngine",
    () => {

        it(
            "creates a blueprint with cognitive distribution",
            () => {

                const questions = [
                    makeQuestion("Q1", "C1"),
                    makeQuestion("Q2", "C1"),
                    makeQuestion("Q3", "C2"),
                    makeQuestion("Q4", "C2"),
                    makeQuestion("Q5", "C3")
                ];

                const engine =
                    new BlueprintEngine();

                const result =
                    engine.build(
                        questions,
                        {
                            phase: "B",
                            subject: "Al-Qur'an Hadis",
                            count: 5,

                            cognitive: {
                                C1: 2,
                                C2: 2,
                                C3: 1
                            }
                        }
                    );

                expect(
                    result.selected
                ).toHaveLength(5);

                expect(
                    result.complete
                ).toBe(true);
            }
        );
    }
);
