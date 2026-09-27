import type {
    ServerResponse
} from "node:http";

import {
    success
} from "./http.js";

import {
    apiConfig
} from "./config.js";

export function healthHandler(
    response: ServerResponse
): void {

    success(
        response,
        {
            status: "ok",

            service:
                "qbank-kbc-21cld",

            version:
                "0.1.0",

            environment:
                apiConfig.nodeEnv,

            timestamp:
                new Date().toISOString()
        }
    );
}
