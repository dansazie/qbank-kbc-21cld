import type {
    ServerResponse
} from "node:http";

import {
    BlueprintEngineV2
} from "../engine/blueprint.engine.v2.js";

import type {
    BlueprintRuleV2
} from "../types/blueprint.js";

import type {
    CognitiveLevel,
    QuestionType
} from "../types/question.js";

import {
    questionService
} from "./repositories.js";

import {
    error,
    methodNotAllowed,
    readJsonBody,
    success
} from "./http.js";

const engine =
    new BlueprintEngineV2();

const cognitiveLevels:
    CognitiveLevel[] = [
        "C1",
        "C2",
        "C3",
        "C4",
        "C5",
        "C6"
    ];

const questionTypes:
    QuestionType[] = [
        "MCQ",
        "MCMA",
        "TRUE_FALSE",
        "MATCHING",
        "SHORT_ANSWER",
        "ESSAY",
        "PERFORMANCE",
        "PROJECT"
    ];

const difficulties = [
    "easy",
    "medium",
    "hard"
] as const;

type Difficulty =
    typeof difficulties[number];

interface BlueprintRequest
    extends Omit<
        BlueprintRuleV2,
        "count"
    > {
    count: number;
}

function isRecord(
    value: unknown
): value is Record<string, unknown> {

    return (
        typeof value ===
        "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

function isPositiveInteger(
    value: unknown
): value is number {

    return (
        typeof value ===
        "number" &&
        Number.isInteger(value) &&
        value > 0
    );
}

function validateDistribution(
    value: unknown,
    allowedKeys?: readonly string[]
): string | undefined {

    if (
        value === undefined
    ) {
        return undefined;
    }

    if (
        !isRecord(value)
    ) {
        return (
            "Distribution harus berupa object."
        );
    }

    for (
        const [key, count]
        of Object.entries(value)
    ) {

        if (
            allowedKeys &&
            !allowedKeys.includes(key)
        ) {
            return (
                `Key distribution tidak valid: ${key}`
            );
        }

        if (
            !isPositiveInteger(count)
        ) {
            return (
                `Nilai distribution.${key} harus integer > 0.`
            );
        }
    }

    return undefined;
}

function distributionTotal(
    value: unknown
): number {

    if (
        !isRecord(value)
    ) {
        return 0;
    }

    return Object.values(
        value
    ).reduce(
        (
            total: number,
            item: unknown
        ): number => {

            if (
                typeof item !== "number"
            ) {
                return total;
            }

            return total + item;
        },
        0
    );
}


function validateRequest(
    body: unknown
): {
    valid: true;
    rule: BlueprintRuleV2;
} | {
    valid: false;
    message: string;
} {

    if (
        !isRecord(body)
    ) {

        return {
            valid: false,
            message:
                "Request body harus berupa object JSON."
        };
    }

    const count =
        body.count;

    if (
        !isPositiveInteger(count)
    ) {

        return {
            valid: false,
            message:
                "Field 'count' wajib berupa integer lebih besar dari 0."
        };
    }

    if (
        count > 1000
    ) {

        return {
            valid: false,
            message:
                "Field 'count' maksimum 1000."
        };
    }

    if (
        body.grade !== undefined &&
        (
            !Number.isInteger(
                body.grade
            ) ||
            Number(body.grade) <= 0
        )
    ) {

        return {
            valid: false,
            message:
                "Field 'grade' harus berupa integer > 0."
        };
    }

    if (
        body.phase !== undefined &&
        typeof body.phase !== "string"
    ) {

        return {
            valid: false,
            message:
                "Field 'phase' harus berupa string."
        };
    }

    if (
        body.subject !== undefined &&
        typeof body.subject !== "string"
    ) {

        return {
            valid: false,
            message:
                "Field 'subject' harus berupa string."
        };
    }

    if (
        body.element !== undefined &&
        typeof body.element !== "string"
    ) {

        return {
            valid: false,
            message:
                "Field 'element' harus berupa string."
        };
    }

    if (
        body.curriculumId !== undefined &&
        typeof body.curriculumId !== "string"
    ) {

        return {
            valid: false,
            message:
                "Field 'curriculumId' harus berupa string."
        };
    }

    if (
        body.cpId !== undefined &&
        typeof body.cpId !== "string"
    ) {

        return {
            valid: false,
            message:
                "Field 'cpId' harus berupa string."
        };
    }

    if (
        body.tpId !== undefined &&
        typeof body.tpId !== "string"
    ) {

        return {
            valid: false,
            message:
                "Field 'tpId' harus berupa string."
        };
    }

    if (
        body.status !== undefined &&
        typeof body.status !== "string"
    ) {

        return {
            valid: false,
            message:
                "Field 'status' harus berupa string."
        };
    }

    if (
        body.blueprintId !== undefined &&
        typeof body.blueprintId !== "string"
    ) {

        return {
            valid: false,
            message:
                "Field 'blueprintId' harus berupa string."
        };
    }

    if (
        body.name !== undefined &&
        typeof body.name !== "string"
    ) {

        return {
            valid: false,
            message:
                "Field 'name' harus berupa string."
        };
    }

    if (
        body.allowFallback !== undefined &&
        typeof body.allowFallback !== "boolean"
    ) {

        return {
            valid: false,
            message:
                "Field 'allowFallback' harus boolean."
        };
    }

    if (
        body.requireAllConstraints !== undefined &&
        typeof body.requireAllConstraints !== "boolean"
    ) {

        return {
            valid: false,
            message:
                "Field 'requireAllConstraints' harus boolean."
        };
    }

    if (
        body.randomize !== undefined &&
        typeof body.randomize !== "boolean"
    ) {

        return {
            valid: false,
            message:
                "Field 'randomize' harus boolean."
        };
    }

    if (
        body.seed !== undefined &&
        typeof body.seed !== "string" &&
        typeof body.seed !== "number"
    ) {

        return {
            valid: false,
            message:
                "Field 'seed' harus berupa string atau number."
        };
    }

    const cognitiveError =
        validateDistribution(
            body.cognitive,
            cognitiveLevels
        );

    if (
        cognitiveError
    ) {

        return {
            valid: false,
            message:
                `cognitive: ${cognitiveError}`
        };
    }

    const questionTypeError =
        validateDistribution(
            body.questionTypes,
            questionTypes
        );

    if (
        questionTypeError
    ) {

        return {
            valid: false,
            message:
                `questionTypes: ${questionTypeError}`
        };
    }

    const difficultyError =
        validateDistribution(
            body.difficulty,
            difficulties
        );

    if (
        difficultyError
    ) {

        return {
            valid: false,
            message:
                `difficulty: ${difficultyError}`
        };
    }

    const cldError =
        validateDistribution(
            body.cld
        );

    if (
        cldError
    ) {

        return {
            valid: false,
            message:
                `cld: ${cldError}`
        };
    }

    const kbcError =
        validateDistribution(
            body.kbc
        );

    if (
        kbcError
    ) {

        return {
            valid: false,
            message:
                `kbc: ${kbcError}`
        };
    }

    const distributions: Array<
        [
            string,
            unknown
        ]
    > = [
            [
                "cognitive",
                body.cognitive
            ],
            [
                "questionTypes",
                body.questionTypes
            ],
            [
                "difficulty",
                body.difficulty
            ]
        ];

    for (
        const [
            name,
            distribution
        ] of distributions
    ) {

        const total =
            distributionTotal(
                distribution
            );

        if (
            total > count
        ) {

            return {
                valid: false,
                message:
                    `Total distribution '${name}' (${total}) tidak boleh melebihi count (${count}).`
            };
        }
    }

    const rule:
        BlueprintRuleV2 = {

        blueprintId:
            typeof body.blueprintId ===
                "string"
                ? body.blueprintId
                : undefined,

        name:
            typeof body.name ===
                "string"
                ? body.name
                : undefined,

        count,

        phase:
            typeof body.phase ===
                "string"
                ? body.phase
                : undefined,

        grade:
            typeof body.grade ===
                "number"
                ? body.grade
                : undefined,

        subject:
            typeof body.subject ===
                "string"
                ? body.subject
                : undefined,

        element:
            typeof body.element ===
                "string"
                ? body.element
                : undefined,

        curriculumId:
            typeof body.curriculumId ===
                "string"
                ? body.curriculumId
                : undefined,

        cpId:
            typeof body.cpId ===
                "string"
                ? body.cpId
                : undefined,

        tpId:
            typeof body.tpId ===
                "string"
                ? body.tpId
                : undefined,

        status:
            typeof body.status ===
                "string"
                ? body.status
                : "published",

        allowFallback:
            typeof body.allowFallback ===
                "boolean"
                ? body.allowFallback
                : undefined,

        requireAllConstraints:
            typeof body.requireAllConstraints ===
                "boolean"
                ? body.requireAllConstraints
                : undefined,

        randomize:
            typeof body.randomize ===
                "boolean"
                ? body.randomize
                : true,

        seed:
            typeof body.seed ===
                "string" ||
                typeof body.seed ===
                "number"
                ? body.seed
                : undefined,

        cognitive:
            body.cognitive as
            BlueprintRuleV2["cognitive"],

        questionTypes:
            body.questionTypes as
            BlueprintRuleV2["questionTypes"],

        difficulty:
            body.difficulty as
            BlueprintRuleV2["difficulty"],

        cld:
            body.cld as
            BlueprintRuleV2["cld"],

        kbc:
            body.kbc as
            BlueprintRuleV2["kbc"]
    };

    return {
        valid: true,
        rule
    };
}

export async function blueprintGenerateHandler(
    response: ServerResponse,
    method: string,
    request: import("node:http").IncomingMessage
): Promise<void> {

    if (
        method !== "POST"
    ) {

        methodNotAllowed(
            response,
            ["POST"]
        );

        return;
    }

    try {

        const body =
            await readJsonBody(
                request
            );

        const validation =
            validateRequest(
                body
            );

        if (
            !validation.valid
        ) {

            error(
                response,
                400,
                "INVALID_BLUEPRINT",
                validation.message
            );

            return;
        }

        const questions =
            questionService.getAll();

        const result =
            engine.build(
                questions,
                validation.rule
            );

        const responseBody = {

            blueprint:
                validation.rule,

            result: {

                selected:
                    result.selected,

                rejected:
                    result.rejected,

                fulfilled:
                    result.fulfilled,

                shortages:
                    result.shortages,

                complete:
                    result.complete,

                score:
                    result.score,

                warnings:
                    result.warnings
            },

            metadata: {

                generatedAt:
                    new Date().toISOString(),

                engine:
                    "BlueprintEngineV2",

                engineVersion:
                    "2.0.0",

                questionPool:
                    questions.length,

                filteredPool:
                    result.selected.length +
                    result.rejected.length
            }
        };

        success(
            response,
            responseBody
        );

    } catch (err) {

        error(
            response,
            400,
            "BLUEPRINT_GENERATION_ERROR",
            err instanceof Error
                ? err.message
                : "Blueprint tidak dapat diproses."
        );
    }
}

export function isBlueprintGeneratePath(
    pathname: string
): boolean {

    return (
        pathname ===
        "/api/blueprints/generate"
    );
}
