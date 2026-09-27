import type {
    IncomingMessage,
    ServerResponse
} from "node:http";

import type {
    Question
} from "../types/question.js";

import {
    questionService
} from "./repositories.js";

function sendJson(
    response: ServerResponse,
    statusCode: number,
    payload: unknown
): void {

    response.statusCode =
        statusCode;

    response.setHeader(
        "Content-Type",
        "application/json; charset=utf-8"
    );

    response.end(
        JSON.stringify(
            payload,
            null,
            2
        )
    );
}

async function readBody(
    request: IncomingMessage
): Promise<unknown> {

    const chunks: Buffer[] = [];

    for await (
        const chunk of request
    ) {

        chunks.push(
            Buffer.isBuffer(chunk)
                ? chunk
                : Buffer.from(chunk)
        );
    }

    if (
        chunks.length === 0
    ) {
        return undefined;
    }

    const raw =
        Buffer.concat(
            chunks
        ).toString("utf8");

    if (
        !raw.trim()
    ) {
        return undefined;
    }

    try {

        return JSON.parse(
            raw
        );

    } catch {

        throw new Error(
            "Request body bukan JSON yang valid."
        );
    }
}

function matches(
    question: Question,
    params: URLSearchParams
): boolean {

    const phase =
        params.get("phase");

    const grade =
        params.get("grade");

    const subject =
        params.get("subject");

    const element =
        params.get("element");

    const status =
        params.get("status");

    const cognitiveLevel =
        params.get(
            "cognitiveLevel"
        );

    const questionType =
        params.get(
            "questionType"
        );

    const difficulty =
        params.get(
            "difficulty"
        );

    const cld =
        params.get("cld");

    const kbc =
        params.get("kbc");

    const search =
        params.get("search")
            ?.trim()
            .toLowerCase();

    if (
        phase &&
        question.phase !== phase
    ) {
        return false;
    }

    if (
        grade &&
        question.grade !==
        Number(grade)
    ) {
        return false;
    }

    if (
        subject &&
        question.subject !== subject
    ) {
        return false;
    }

    if (
        element &&
        question.element !== element
    ) {
        return false;
    }

    if (
        status &&
        question.status !== status
    ) {
        return false;
    }

    if (
        cognitiveLevel &&
        question.cognitiveLevel !==
        cognitiveLevel
    ) {
        return false;
    }

    if (
        questionType &&
        question.questionType !==
        questionType
    ) {
        return false;
    }

    if (
        difficulty &&
        question.difficulty !==
        difficulty
    ) {
        return false;
    }

    if (
        cld &&
        !(question.cld ?? [])
            .some(
                mapping =>
                    mapping.dimension ===
                    cld
            )
    ) {
        return false;
    }

    if (
        kbc &&
        question.kbc?.primary !==
        kbc
    ) {
        return false;
    }

    if (search) {

        const haystack = [
            question.questionId,
            question.subject,
            question.element,
            question.stem,
            question.materialScope,
            question.indicator,
            ...(question.tags ?? [])
        ]
            .join(" ")
            .toLowerCase();

        if (
            !haystack.includes(
                search
            )
        ) {
            return false;
        }
    }

    return true;
}

function validationError(
    response: ServerResponse,
    validation: ReturnType<
        typeof questionService.validateQuestion
    >
): void {

    sendJson(
        response,
        422,
        {
            error: {
                code:
                    "QUESTION_VALIDATION_FAILED",

                message:
                    "Question gagal validasi.",

                details:
                    validation.errors,

                warnings:
                    validation.warnings
            }
        }
    );
}

export async function questionsHandler(
    response: ServerResponse,
    request: IncomingMessage,
    url: URL
): Promise<void> {

    try {

        const method =
            request.method ??
            "GET";

        const pathname =
            url.pathname;

        /*
         * GET /api/questions
         */
        if (
            method === "GET" &&
            pathname ===
            "/api/questions"
        ) {

            const pageRaw =
                Number(
                    url.searchParams.get(
                        "page"
                    ) ?? "1"
                );

            const limitRaw =
                Number(
                    url.searchParams.get(
                        "limit"
                    ) ?? "20"
                );

            const page =
                Number.isFinite(
                    pageRaw
                )
                    ? Math.max(
                        1,
                        Math.floor(
                            pageRaw
                        )
                    )
                    : 1;

            const limit =
                Number.isFinite(
                    limitRaw
                )
                    ? Math.min(
                        100,
                        Math.max(
                            1,
                            Math.floor(
                                limitRaw
                            )
                        )
                    )
                    : 20;

            const all =
                questionService.getAll();

            const filtered =
                all.filter(
                    question =>
                        matches(
                            question,
                            url.searchParams
                        )
                );

            const total =
                filtered.length;

            const totalPages =
                total === 0
                    ? 0
                    : Math.ceil(
                        total / limit
                    );

            const start =
                (page - 1) * limit;

            const items =
                filtered.slice(
                    start,
                    start + limit
                );

            sendJson(
                response,
                200,
                {
                    data: {
                        items,

                        pagination: {
                            page,
                            limit,
                            total,
                            totalPages
                        }
                    }
                }
            );

            return;
        }

        /*
         * GET /api/questions/:id
         */
        if (
            method === "GET" &&
            pathname.startsWith(
                "/api/questions/"
            )
        ) {

            const questionId =
                decodeURIComponent(
                    pathname.substring(
                        "/api/questions/"
                            .length
                    )
                );

            if (
                !questionId
            ) {

                sendJson(
                    response,
                    400,
                    {
                        error: {
                            code:
                                "QUESTION_ID_REQUIRED",

                            message:
                                "Question ID wajib diisi."
                        }
                    }
                );

                return;
            }

            const question =
                questionService.getById(
                    questionId
                );

            if (!question) {

                sendJson(
                    response,
                    404,
                    {
                        error: {
                            code:
                                "QUESTION_NOT_FOUND",

                            message:
                                `Question '${questionId}' tidak ditemukan.`
                        }
                    }
                );

                return;
            }

            sendJson(
                response,
                200,
                {
                    data: question
                }
            );

            return;
        }

        /*
         * POST /api/questions
         */
        if (
            method === "POST" &&
            pathname ===
            "/api/questions"
        ) {

            const body =
                await readBody(
                    request
                );

            if (
                !body ||
                typeof body !==
                "object"
            ) {

                sendJson(
                    response,
                    400,
                    {
                        error: {
                            code:
                                "INVALID_BODY",

                            message:
                                "Request body harus berupa JSON object."
                        }
                    }
                );

                return;
            }

            const question =
                body as Question;

            const validation =
                questionService
                    .validateQuestion(
                        question
                    );

            if (
                !validation.valid
            ) {

                validationError(
                    response,
                    validation
                );

                return;
            }

            const created =
                questionService.create(
                    question
                );

            sendJson(
                response,
                201,
                {
                    data: created
                }
            );

            return;
        }

        /*
         * PUT /api/questions/:id
         */
        if (
            method === "PUT" &&
            pathname.startsWith(
                "/api/questions/"
            )
        ) {

            const questionId =
                decodeURIComponent(
                    pathname.substring(
                        "/api/questions/"
                            .length
                    )
                );

            const existing =
                questionService.getById(
                    questionId
                );

            if (!existing) {

                sendJson(
                    response,
                    404,
                    {
                        error: {
                            code:
                                "QUESTION_NOT_FOUND",

                            message:
                                `Question '${questionId}' tidak ditemukan.`
                        }
                    }
                );

                return;
            }

            const body =
                await readBody(
                    request
                );

            if (
                !body ||
                typeof body !==
                "object"
            ) {

                sendJson(
                    response,
                    400,
                    {
                        error: {
                            code:
                                "INVALID_BODY",

                            message:
                                "Request body harus berupa JSON object."
                        }
                    }
                );

                return;
            }

            const updated: Question = {
                ...existing,
                ...(body as Partial<Question>),
                questionId
            };

            const validation =
                questionService
                    .validateQuestion(
                        updated
                    );

            if (
                !validation.valid
            ) {

                validationError(
                    response,
                    validation
                );

                return;
            }

            const result =
                questionService.update(
                    questionId,
                    updated
                );

            sendJson(
                response,
                200,
                {
                    data: result
                }
            );

            return;
        }

        /*
         * DELETE /api/questions/:id
         */
        if (
            method === "DELETE" &&
            pathname.startsWith(
                "/api/questions/"
            )
        ) {

            const questionId =
                decodeURIComponent(
                    pathname.substring(
                        "/api/questions/"
                            .length
                    )
                );

            const deleted =
                questionService.delete(
                    questionId
                );

            if (!deleted) {

                sendJson(
                    response,
                    404,
                    {
                        error: {
                            code:
                                "QUESTION_NOT_FOUND",

                            message:
                                `Question '${questionId}' tidak ditemukan.`
                        }
                    }
                );

                return;
            }

            sendJson(
                response,
                200,
                {
                    data: {
                        questionId,
                        deleted: true
                    }
                }
            );

            return;
        }

        sendJson(
            response,
            405,
            {
                error: {
                    code:
                        "METHOD_NOT_ALLOWED",

                    message:
                        "HTTP method tidak didukung untuk endpoint questions."
                }
            }
        );

    } catch (error) {

        sendJson(
            response,
            500,
            {
                error: {
                    code:
                        "QUESTION_API_ERROR",

                    message:
                        error instanceof Error
                            ? error.message
                            : "Unknown error."
                }
            }
        );
    }
}
