import {
    createServer,
    type IncomingMessage,
    type ServerResponse
} from "node:http";

import {
    QuestionService
} from "../services/question.service.js";

import {
    BlueprintEngine,
    type BlueprintRule
} from "../engine/blueprint.engine.js";

import {
    ReferenceRepository
} from "../repositories/reference.repository.js";

import {
    ReferenceService
} from "../services/reference.service.js";

import {
    referenceData
} from "../data/reference.data.js";


const questionService =
    new QuestionService();

const blueprintEngine =
    new BlueprintEngine();

const PORT =
    Number(
        process.env.PORT ?? 3000
    );

function sendJson(
    response: ServerResponse,
    status: number,
    data: unknown
): void {

    response.writeHead(
        status,
        {
            "Content-Type":
                "application/json; charset=utf-8",

            "Access-Control-Allow-Origin":
                "*",

            "Access-Control-Allow-Methods":
                "GET,POST,OPTIONS",

            "Access-Control-Allow-Headers":
                "Content-Type"
        }
    );

    response.end(
        JSON.stringify(
            data,
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
            Buffer.from(chunk)
        );
    }

    if (chunks.length === 0) {
        return {};
    }

    const body =
        Buffer.concat(chunks)
            .toString("utf8");

    if (!body.trim()) {
        return {};
    }

    return JSON.parse(body);
}

function parseQuery(
    url: URL
): Record<string, string> {

    return Object.fromEntries(
        url.searchParams.entries()
    );
}

async function router(
    request: IncomingMessage,
    response: ServerResponse
): Promise<void> {

    if (
        request.method === "OPTIONS"
    ) {
        sendJson(
            response,
            204,
            null
        );

        return;
    }

    const url =
        new URL(
            request.url ?? "/",
            `http://localhost:${PORT}`
        );

    const pathname =
        url.pathname;

    // ----------------------------
    // HEALTH
    // ----------------------------

    if (
        request.method === "GET" &&
        pathname === "/api/health"
    ) {

        sendJson(
            response,
            200,
            {
                status: "ok",
                service:
                    "qbank-kbc-21cld",
                version: "0.1.0",
                timestamp:
                    new Date().toISOString()
            }
        );

        return;
    }

    // ----------------------------
    // STATISTICS
    // ----------------------------

    if (
        request.method === "GET" &&
        pathname === "/api/statistics"
    ) {

        sendJson(
            response,
            200,
            questionService.statistics()
        );

        return;
    }

    // ----------------------------
    // QUESTIONS
    // ----------------------------

    if (
        request.method === "GET" &&
        pathname === "/api/questions"
    ) {

        const query =
            parseQuery(url);

        const questions =
            questionService.search({
                phase:
                    query.phase,

                subject:
                    query.subject,

                status:
                    query.status as any,

                cognitiveLevel:
                    query.cognitiveLevel as any,

                questionType:
                    query.questionType as any,

                difficulty:
                    query.difficulty as any,

                cldDimension:
                    query.cldDimension,

                kbcPrimary:
                    query.kbcPrimary,

                tag:
                    query.tag
            });

        sendJson(
            response,
            200,
            {
                data: questions,
                meta: {
                    total:
                        questions.length
                }
            }
        );

        return;
    }

    // ----------------------------
    // QUESTION BY ID
    // ----------------------------

    if (
        request.method === "GET" &&
        pathname.startsWith(
            "/api/questions/"
        )
    ) {

        const id =
            decodeURIComponent(
                pathname.replace(
                    "/api/questions/",
                    ""
                )
            );

        const question =
            questionService.getById(
                id
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
                            `Question ${id} tidak ditemukan.`
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

    // ----------------------------
    // VALIDATE ALL
    // ----------------------------

    if (
        request.method === "GET" &&
        pathname ===
        "/api/questions/validation"
    ) {

        const result =
            questionService.validateAll();

        sendJson(
            response,
            200,
            {
                data: result
            }
        );

        return;
    }

    // ----------------------------
    // VALIDATE QUESTION
    // ----------------------------

    if (
        request.method === "POST" &&
        pathname ===
        "/api/questions/validate"
    ) {

        try {

            const body =
                await readBody(request);

            const result =
                questionService.validate(
                    body as any
                );

            sendJson(
                response,
                200,
                {
                    data: result
                }
            );

        } catch (error) {

            sendJson(
                response,
                400,
                {
                    error: {
                        code:
                            "INVALID_REQUEST",

                        message:
                            error instanceof Error
                                ? error.message
                                : "Request tidak valid."
                    }
                }
            );
        }

        return;
    }

    // ----------------------------
    // BLUEPRINT
    // ----------------------------

    if (
        request.method === "POST" &&
        pathname ===
        "/api/blueprints/generate"
    ) {

        try {

            const body =
                await readBody(request) as {
                    rule: BlueprintRule;
                };

            const questions =
                questionService.getAll();

            const result =
                blueprintEngine.build(
                    questions,
                    body.rule
                );

            sendJson(
                response,
                200,
                {
                    data: result
                }
            );

        } catch (error) {

            sendJson(
                response,
                400,
                {
                    error: {
                        code:
                            "BLUEPRINT_ERROR",

                        message:
                            error instanceof Error
                                ? error.message
                                : "Blueprint tidak valid."
                    }
                }
            );
        }

        return;
    }

    // ----------------------------
    // 404
    // ----------------------------

    sendJson(
        response,
        404,
        {
            error: {
                code:
                    "ROUTE_NOT_FOUND",

                message:
                    `${request.method} ${pathname} tidak ditemukan.`
            }
        }
    );
}

const server =
    createServer(
        (request, response) => {

            router(
                request,
                response
            ).catch(
                error => {

                    console.error(
                        error
                    );

                    sendJson(
                        response,
                        500,
                        {
                            error: {
                                code:
                                    "INTERNAL_SERVER_ERROR",

                                message:
                                    "Internal server error."
                            }
                        }
                    );
                }
            );
        }
    );

server.listen(
    PORT,
    () => {

        console.log(
            `QBank API running at http://localhost:${PORT}`
        );

        console.log(
            `Health: http://localhost:${PORT}/api/health`
        );
    }
);
