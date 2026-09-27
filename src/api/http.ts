import type {
    IncomingMessage,
    ServerResponse
} from "node:http";

export interface ApiErrorBody {
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}

export function json(
    response: ServerResponse,
    statusCode: number,
    body: unknown
): void {

    const payload =
        JSON.stringify(body);

    response.statusCode =
        statusCode;

    response.setHeader(
        "Content-Type",
        "application/json; charset=utf-8"
    );

    response.setHeader(
        "Cache-Control",
        "no-store"
    );

    response.end(payload);
}

export function success(
    response: ServerResponse,
    data: unknown,
    statusCode = 200
): void {

    json(
        response,
        statusCode,
        {
            data
        }
    );
}

export function error(
    response: ServerResponse,
    statusCode: number,
    code: string,
    message: string,
    details?: unknown
): void {

    const body:
        ApiErrorBody = {

        error: {
            code,
            message
        }
    };

    if (
        details !==
        undefined
    ) {

        body.error.details =
            details;
    }

    json(
        response,
        statusCode,
        body
    );
}

export function notFound(
    response: ServerResponse
): void {

    error(
        response,
        404,
        "NOT_FOUND",
        "Resource tidak ditemukan."
    );
}

export function methodNotAllowed(
    response: ServerResponse,
    allowed: string[]
): void {

    response.setHeader(
        "Allow",
        allowed.join(", ")
    );

    error(
        response,
        405,
        "METHOD_NOT_ALLOWED",
        "HTTP method tidak didukung."
    );
}

export function parseUrl(
    request: IncomingMessage
): URL {

    return new URL(
        request.url ?? "/",
        `http://${request.headers.host ?? "localhost"}`
    );
}

export function parseInteger(
    value:
        string | null,
    defaultValue: number,
    minimum: number,
    maximum: number
): number {

    if (
        value === null ||
        value.trim() === ""
    ) {

        return defaultValue;
    }

    const parsed =
        Number(value);

    if (
        !Number.isInteger(parsed)
    ) {

        throw new Error(
            `Nilai harus berupa integer: ${value}`
        );
    }

    if (
        parsed < minimum ||
        parsed > maximum
    ) {

        throw new Error(
            `Nilai harus berada pada rentang ${minimum}-${maximum}.`
        );
    }

    return parsed;
}

export async function readJsonBody(
    request: IncomingMessage
): Promise<unknown> {

    const chunks:
        Buffer[] = [];

    for await (
        const chunk
        of request
    ) {

        chunks.push(
            Buffer.from(chunk)
        );
    }

    const raw =
        Buffer.concat(
            chunks
        ).toString("utf8");

    if (!raw.trim()) {
        return {};
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
