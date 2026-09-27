import type {
    FrameworkLibrary
} from "../types/framework.js";

import {
    cldFramework,
    kbcFramework
} from "./framework.data.js";

const frameworks:
    FrameworkLibrary[] = [
        cldFramework,
        kbcFramework
    ];

export class FrameworkRepository {

    getAll():
        FrameworkLibrary[] {

        return [
            ...frameworks
        ];
    }

    getById(
        frameworkId: string
    ):
        FrameworkLibrary |
        undefined {

        return frameworks.find(
            framework =>
                framework.frameworkId ===
                frameworkId
        );
    }

    getCLD():
        FrameworkLibrary {

        return cldFramework;
    }

    getKBC():
        FrameworkLibrary {

        return kbcFramework;
    }
}
