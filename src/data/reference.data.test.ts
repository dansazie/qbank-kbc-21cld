import {
    describe,
    expect,
    it
} from "vitest";

import {
    referenceData
} from "./reference.data.js";

describe(
    "Reference data",
    () => {

        it(
            "memiliki reference aktif",
            () => {

                expect(
                    referenceData.length
                ).toBeGreaterThan(0);
            }
        );

        it(
            "setiap reference memiliki ID",
            () => {

                for (
                    const reference
                    of referenceData
                ) {

                    expect(
                        reference.referenceId
                    ).toBeTruthy();

                    expect(
                        reference.title
                    ).toBeTruthy();

                    expect(
                        reference.issuer
                    ).toBeTruthy();

                    expect(
                        reference.currentVersion
                    ).toBeTruthy();
                }
            }
        );
    }
);
