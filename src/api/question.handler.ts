import type {
    ServerResponse
} from "node:http";

import {
    questionService,
    findQuestion
} from "./repositories.js";

import {
    error,
    methodNotAllowed,
    notFound,
    parseInteger,
    success
} from "./http.js";

export function questionListHandler(
    response: ServerResponse,
    requestUrl: URL
): void {

    try {

        const page =
            parseInteger(
                requestUrl.searchParams.get(
                    "page"
                ),
                1,
                1,
                100000
            );

        const limit =
            parseInteger(
                requestUrl.searchParams.get(
                    "limit"
                ),
                20,
                1,
                100
            );

        const phase =
            requestUrl.searchParams.get(
                "phase"
            );

        const subject =
            requestUrl.searchParams.get(
                "subject"
            );

        const status =
            requestUrl.searchParams.get(
                "status"
            );

        const cognitiveLevel =
            requestUrl.searchParams.get(
                "cognitiveLevel"
            );

        const questionType =
            requestUrl.searchParams.get(
                "questionType"
            );

        const difficulty =
            requestUrl.searchParams.get(
                "difficulty"
            );

        let filtered =
            questionService.getAll();

        if (phase) {

            filtered =
                filtered.filter(
                    question =>
                        question.phase ===
                        phase
                );
        }

        if (subject) {

            filtered =
                filtered.filter(
                    question =>
                        question.subject ===
                        subject
                );
        }

        if (status) {

            filtered =
                filtered.filter(
                    question =>
                        question.status ===
                        status
                );
        }

        if (cognitiveLevel) {

            filtered =
                filtered.filter(
                    question =>
                        question.cognitiveLevel ===
                        cognitiveLevel
                );
        }

        if (questionType) {

            filtered =
                filtered.filter(
                    question =>
                        question.questionType ===
                        questionType
                );
        }

        if (difficulty) {

            filtered =
                filtered.filter(
                    question =>
                        question.difficulty ===
                        difficulty
                );
        }

        const total =
            filtered.length;

        const totalPages =
            total === 0
                ? 0
                : Math.ceil(
                    total / limit
                );

        const offset =
            (page - 1) * limit;

        const data =
            filtered.slice(
                offset,
                offset + limit
            );

        success(
            response,
            {
                items: data,

                pagination: {
                    page,
                    limit,
                    total,
                    totalPages
                }
            }
        );

    } catch (err) {

        error(
            response,
            400,
            "INVALID_QUERY",
            err instanceof Error
                ? err.message
                : "Query parameter tidak valid."
        );
    }
}

export function questionDetailHandler(
    response: ServerResponse,
    questionId: string
): void {

    const question =
        findQuestion(
            questionId
        );

    if (!question) {

        notFound(
            response
        );

        return;
    }

    success(
        response,
        question
    );
}

export function questionsHandler(
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

        const questionId =
            decodeURIComponent(
                parts
                    .slice(2)
                    .join("/")
            );

        questionDetailHandler(
            response,
            questionId
        );

        return;
    }

    questionListHandler(
        response,
        requestUrl
    );
}
