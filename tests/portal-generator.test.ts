import {
    describe,
    expect,
    it
} from "vitest";

import {
    buildPortalWorksheet
} from "../src/api/portal.api.js";

import {
    QuestionService
} from "../src/services/question.service.js";

describe(
    "Portal generator contract",
    () => {

        it(
            "produces student-safe portal data",
            () => {

                const service =
                    new QuestionService();

                const questions =
                    service.getAll();

                if (
                    questions.length === 0
                ) {
                    return;
                }

                const result =
                    buildPortalWorksheet(
                        questions,
                        {
                            worksheetId:
                                "PORTAL-GENERATOR-TEST",

                            title:
                                "Portal Test",

                            instructions:
                                "Kerjakan.",

                            blueprint: {
                                count: 1,

                                phase:
                                    questions[0].phase,

                                subject:
                                    questions[0].subject,

                                randomize:
                                    false
                            }
                        }
                    );

                expect(
                    result.worksheet.questions
                ).toHaveLength(1);

                for (
                    const question
                    of result.worksheet.questions
                ) {
                    expect(
                        question
                    ).not.toHaveProperty(
                        "answer"
                    );

                    expect(
                        question
                    ).not.toHaveProperty(
                        "explanation"
                    );
                }
            }
        );

    }
);
