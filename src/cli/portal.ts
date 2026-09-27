import {
    mkdir,
    writeFile
} from "node:fs/promises";

import { QuestionService } from "../services/question.service.js";
import {
    buildPortalWorksheet
} from "../api/portal.api.js";

interface PortalConfig {
    fileName: string;
    worksheetId: string;
    title: string;
    subject: string;
    count: number;
}

const configs: PortalConfig[] = [
    {
        fileName: "kbc.json",
        worksheetId: "PORTAL-KBC-001",
        title: "Latihan KBC",
        subject: "Al-Qur'an Hadis",
        count: 1
    }
];


export async function generatePortal() {

    const service =
        new QuestionService();

    const questions =
        service.getAll();

    const outputDirectory =
        "generated/portal";

    await mkdir(
        outputDirectory,
        {
            recursive: true
        }
    );

    for (
        const config of configs
    ) {

        const result =
            buildPortalWorksheet(
                questions,
                {
                    worksheetId:
                        config.worksheetId,

                    title:
                        config.title,

                    instructions:
                        "Kerjakan dengan teliti.",

                    blueprint: {
                        blueprintId:
                            config.worksheetId,

                        count:
                            config.count,

                        phase:
                            "B",

                        subject:
                            config.subject,

                        randomize:
                            false,

                        allowFallback:
                            false,

                        requireAllConstraints:
                            false
                    }
                }
            );

        if (
            !result.blueprint.complete
        ) {
            throw new Error(
                [
                    `Blueprint portal '${config.subject}' tidak lengkap.`,
                    `Requested: ${result.blueprint.requested}`,
                    `Selected: ${result.blueprint.selected}`,
                    `Warnings: ${result.blueprint.warnings.join("; ")}`
                ].join("\n")
            );
        }

        const output =
            JSON.stringify(
                result.worksheet,
                null,
                2
            );

        await writeFile(
            `${outputDirectory}/${config.fileName}`,
            `${output}\n`,
            "utf8"
        );

        console.log(
            `Generated: ${outputDirectory}/${config.fileName}`
        );
    }
}
