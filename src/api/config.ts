import process from "node:process";

export interface ApiConfig {
    host: string;
    port: number;
    nodeEnv: string;
}

function parsePort(
    value: string | undefined
): number {

    if (!value) {
        return 3000;
    }

    const port =
        Number(value);

    if (
        !Number.isInteger(port) ||
        port < 1 ||
        port > 65535
    ) {
        throw new Error(
            `PORT tidak valid: ${value}`
        );
    }

    return port;
}

export const apiConfig:
    ApiConfig = {

    host:
        process.env.API_HOST ??
        "0.0.0.0",

    port:
        parsePort(
            process.env.PORT
        ),

    nodeEnv:
        process.env.NODE_ENV ??
        "development"
};
