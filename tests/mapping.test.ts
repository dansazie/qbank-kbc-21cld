import {
    describe,
    expect,
    it
} from "vitest";

import {
    MappingEngine
} from "../src/engine/mapping.engine.js";

import type {
    Question
} from "../src/types/question.js";

const question = {
    questionId: "MAP-001",

    phase: "B",

    subject: "Al-Qur'an Hadis",

    element: "Al-Qur'an",

    cpId: "CP-001",

    tpId: "TP-001",

    materialScope: "Test",

    indicator: "Test",

    cld: [
        {
            dimension: "21CLD-KC",
            evidence: "Test"
        }
    ],

    kbc: {
        primary: "KBC-C01",
        evidence: "Test"
    }
} as Question;

describe(
    "MappingEngine",
    () => {

        it(
            "detects valid curriculum mapping",
            () => {

                const engine =
                    new MappingEngine();

                const result =
                    engine.inspect(
                        question
                    );

                expect(
                    result.curriculum.valid
                ).toBe(true);

                expect(
                    result.cld.valid
                ).toBe(true);

                expect(
                    result.kbc.valid
                ).toBe(true);
            }
        );
    }
);
