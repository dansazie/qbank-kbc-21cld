import {
    describe,
    expect,
    it
} from "vitest";

import {
    FrameworkRepository
} from "../src/data/framework.repository.js";

describe(
    "Framework repository",
    () => {

        const repository =
            new FrameworkRepository();

        it(
            "memiliki framework 21CLD",
            () => {

                const framework =
                    repository.getCLD();

                expect(
                    framework.frameworkId
                ).toBe(
                    "FRAMEWORK-21CLD"
                );

                expect(
                    framework.dimensions.length
                ).toBeGreaterThan(0);
            }
        );

        it(
            "memiliki framework KBC",
            () => {

                const framework =
                    repository.getKBC();

                expect(
                    framework.frameworkId
                ).toBe(
                    "FRAMEWORK-KBC"
                );

                expect(
                    framework.dimensions.length
                ).toBeGreaterThan(0);
            }
        );

        it(
            "dapat mencari framework",
            () => {

                const framework =
                    repository.getById(
                        "FRAMEWORK-21CLD"
                    );

                expect(
                    framework
                ).toBeDefined();
            }
        );
    }
);
