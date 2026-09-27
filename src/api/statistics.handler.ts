import type {
    ServerResponse
} from "node:http";

import {
    questionService
} from "./repositories.js";

import {
    methodNotAllowed,
    success
} from "./http.js";

function increment(
    target: Record<string, number>,
    key: string
): void {

    target[key] =
        (
            target[key] ??
            0
        ) + 1;
}

export function statisticsHandler(
    response: ServerResponse,
    method: string
): void {

    if (
        method !==
        "GET"
    ) {

        methodNotAllowed(
            response,
            ["GET"]
        );

        return;
    }

    const questions =
        questionService.getAll();

    const byPhase:
        Record<string, number> = {};

    const bySubject:
        Record<string, number> = {};

    const byCognitiveLevel:
        Record<string, number> = {};

    const byType:
        Record<string, number> = {};

    const byStatus:
        Record<string, number> = {};

    const byDifficulty:
        Record<string, number> = {};

    const byCLD:
        Record<string, number> = {};

    const byKBC:
        Record<string, number> = {};

    for (
        const question
        of questions
    ) {

        increment(
            byPhase,
            question.phase
        );

        increment(
            bySubject,
            question.subject
        );

        increment(
            byCognitiveLevel,
            question.cognitiveLevel
        );

        increment(
            byType,
            question.questionType
        );

        increment(
            byStatus,
            question.status
        );

        if (
            question.difficulty
        ) {

            increment(
                byDifficulty,
                question.difficulty
            );
        }

        for (
            const mapping
            of question.cld ?? []
        ) {

            increment(
                byCLD,
                mapping.dimension
            );
        }

        const primary =
            question.kbc?.primary;

        if (primary) {

            increment(
                byKBC,
                primary
            );
        }
    }

    success(
        response,
        {
            total:
                questions.length,

            byPhase,

            bySubject,

            byCognitiveLevel,

            byType,

            byStatus,

            byDifficulty,

            byCLD,

            byKBC
        }
    );
}
