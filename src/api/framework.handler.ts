import type {
    ServerResponse
} from "node:http";

import {
    frameworkRepository
} from "./repositories.js";

import {
    methodNotAllowed,
    notFound,
    success
} from "./http.js";

export function frameworksHandler(
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

        const frameworkId =
            decodeURIComponent(
                parts
                    .slice(2)
                    .join("/")
            );

        const framework =
            frameworkRepository.getById(
                frameworkId
            );

        if (!framework) {

            notFound(
                response
            );

            return;
        }

        success(
            response,
            framework
        );

        return;
    }

    success(
        response,
        {
            items:
                frameworkRepository.getAll()
        }
    );
}
