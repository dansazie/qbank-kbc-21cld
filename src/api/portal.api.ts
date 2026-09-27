import type { Question } from "../types/question.js";
import type { BlueprintRuleV2 } from "../types/blueprint.js";

import { BlueprintEngineV2 } from "../engine/blueprint.engine.v2.js";
import {
    serializeWorksheet
} from "./worksheet.serializer.js";

export interface PortalWorksheetRequest {
    worksheetId: string;
    title?: string;
    instructions?: string;
    blueprint: BlueprintRuleV2;
}

export function buildPortalWorksheet(
    questions: Question[],
    request: PortalWorksheetRequest
) {
    const engine =
        new BlueprintEngineV2();

    const result =
        engine.build(
            questions,
            request.blueprint
        );

    const worksheet =
        serializeWorksheet(
            result.selected,
            {
                worksheetId:
                    request.worksheetId,

                title:
                    request.title,

                instructions:
                    request.instructions
            }
        );

    return {
        worksheet,
        blueprint: {
            blueprintId:
                request.blueprint.blueprintId,

            complete:
                result.complete,

            selected:
                result.selected.length,

            requested:
                request.blueprint.count,

            score:
                result.score,

            shortages:
                result.shortages,

            warnings:
                result.warnings
        }
    };
}
