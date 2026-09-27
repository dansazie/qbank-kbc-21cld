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
                    "GET, OPTIONS"
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

                if (
                    method !==
                    "GET"
                ) {

                    error(
                        response,
                        405,
                        "METHOD_NOT_ALLOWED",
                        "Hanya GET dan OPTIONS yang didukung pada API ini."
                    );

                    return;
                }

                if (
                    url.pathname ===
                    "/health"
                ) {

                    healthHandler(
                        response
                    );

                    return;
                }

                if (
                    url.pathname ===
                    "/api/questions" ||
                    url.pathname.startsWith(
                        "/api/questions/"
                    )
                ) {

                    questionsHandler(
                        response,
                        method,
                        url
                    );

                    return;
                }

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
    error => {

        console.error(
            "API server error:",
            error
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
