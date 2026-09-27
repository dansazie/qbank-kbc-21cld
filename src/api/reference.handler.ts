import type {
    ServerResponse
} from "node:http";

import {
    referenceData,
    findReference
} from "./repositories.js";

import {
    methodNotAllowed,
    notFound,
    success
} from "./http.js";

export function referencesHandler(
    response: ServerResponse,
    method: string,
    requestUrl: URL
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

    const parts =
        requestUrl.pathname
            .split("/")
            .filter(Boolean);

    if (
        parts.length >= 3
    ) {

        const referenceId =
            decodeURIComponent(
                parts
                    .slice(2)
                    .join("/")
            );

        const reference =
            findReference(
                referenceId
            );

        if (!reference) {

            notFound(
                response
            );

            return;
        }

        success(
            response,
            reference
        );

        return;
    }

    success(
        response,
        {
            items:
                referenceData,

            total:
                referenceData.length
        }
    );
}
