import {
    createServer
} from "node:http";

import {
    apiConfig
} from "./config.js";

import {
    error,
    notFound,
    parseUrl
} from "./http.js";

import {
    healthHandler
} from "./health.js";

import {
    questionsHandler
} from "./question.handler.js";

import {
    referencesHandler
} from "./reference.handler.js";

import {
    frameworksHandler
} from "./framework.handler.js";

import {
    statisticsHandler
} from "./statistics.handler.js";

import {
    blueprintGenerateHandler,
    isBlueprintGeneratePath
} from "./blueprint.handler.js";

const server =
    createServer(
        async (
            request,
            response
        ) => {

            try {

                response.setHeader(
                    "Access-Control-Allow-Origin",
                    "*"
                );

                response.setHeader(
                    "Access-Control-Allow-Methods",
                    "GET, POST, PUT, DELETE, OPTIONS"
                );

                response.setHeader(
                    "Access-Control-Allow-Headers",
                    "Content-Type"
                );

                if (
                    request.method ===
                    "OPTIONS"
                ) {

                    response.statusCode =
                        204;

                    response.end();

                    return;
                }

                const url =
                    parseUrl(
                        request
                    );

                const method =
                    request.method ??
                    "GET";

                /*
                 * POST /api/blueprints/generate
                 */
                if (
                    isBlueprintGeneratePath(
                        url.pathname
                    )
                ) {

                    await blueprintGenerateHandler(
                        response,
                        method,
                        request
                    );

                    return;
                }

                /*
                 * Health
                 */
                if (
                    method === "GET" &&
                    url.pathname ===
                    "/health"
                ) {

                    healthHandler(
                        response
                    );

                    return;
                }

                /*
                 * Questions
                 *
                 * Sengaja diproses sebelum
                 * method guard karena endpoint
                 * questions mendukung:
                 *
                 * GET
                 * POST
                 * PUT
                 * DELETE
                 */
                if (
                    url.pathname ===
                    "/api/questions" ||
                    url.pathname.startsWith(
                        "/api/questions/"
                    )
                ) {

                    await questionsHandler(
                        response,
                        request,
                        url
                    );

                    return;
                }

                /*
                 * Endpoint lain
                 * saat ini read-only.
                 */
                if (
                    method !== "GET"
                ) {

                    error(
                        response,
                        405,
                        "METHOD_NOT_ALLOWED",
                        "HTTP method tidak didukung."
                    );

                    return;
                }

                /*
                 * References
                 */
                if (
                    url.pathname ===
                    "/api/references" ||
                    url.pathname.startsWith(
                        "/api/references/"
                    )
                ) {

                    referencesHandler(
                        response,
                        method,
                        url
                    );

                    return;
                }

                /*
                 * Frameworks
                 */
                if (
                    url.pathname ===
                    "/api/frameworks" ||
                    url.pathname.startsWith(
                        "/api/frameworks/"
                    )
                ) {

                    frameworksHandler(
                        response,
                        method,
                        url
                    );

                    return;
                }

                /*
                 * Statistics
                 */
                if (
                    url.pathname ===
                    "/api/statistics"
                ) {

                    statisticsHandler(
                        response,
                        method
                    );

                    return;
                }

                /*
                 * Blueprint root
                 */
                if (
                    url.pathname ===
                    "/api/blueprints"
                ) {

                    error(
                        response,
                        405,
                        "METHOD_NOT_ALLOWED",
                        "Gunakan POST /api/blueprints/generate untuk menghasilkan paket soal."
                    );

                    return;
                }

                notFound(
                    response
                );

            } catch (err) {

                console.error(
                    err
                );

                error(
                    response,
                    500,
                    "INTERNAL_ERROR",
                    "Terjadi kesalahan internal."
                );
            }
        }
    );

server.on(
    "error",
    serverError => {

        console.error(
            "API server error:",
            serverError
        );

        process.exitCode =
            1;
    }
);

server.listen(
    apiConfig.port,
    apiConfig.host,
    () => {

        console.log(
            [
                "",
                "QBank KBC × 21CLD API",
                "",
                `Environment: ${apiConfig.nodeEnv}`,
                `Host: ${apiConfig.host}`,
                `Port: ${apiConfig.port}`,
                "",
                `Health: http://localhost:${apiConfig.port}/health`,
                `Questions: http://localhost:${apiConfig.port}/api/questions`,
                `References: http://localhost:${apiConfig.port}/api/references`,
                `Frameworks: http://localhost:${apiConfig.port}/api/frameworks`,
                `Statistics: http://localhost:${apiConfig.port}/api/statistics`,
                `Blueprint: POST http://localhost:${apiConfig.port}/api/blueprints/generate`,
                ""
            ].join("\n")
        );
    }
);

function shutdown(
    signal: string
): void {

    console.log(
        `Received ${signal}. Shutting down...`
    );

    server.close(
        () => {

            console.log(
                "HTTP server closed."
            );

            process.exit(
                0
            );
        }
    );
}

process.on(
    "SIGINT",
    () =>
        shutdown("SIGINT")
);

process.on(
    "SIGTERM",
    () =>
        shutdown("SIGTERM")
);
