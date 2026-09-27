import type {
    Question
} from "../types/question.js";

export interface MappingReport {
    curriculum: {
        valid: boolean;
        missing: string[];
    };

    cld: {
        valid: boolean;
        dimensions: string[];
        evidence: string[];
    };

    kbc: {
        valid: boolean;
        values: string[];
        evidence?: string;
    };
}

export class MappingEngine {

    inspect(question: Question): MappingReport {
        const missing: string[] = [];

        if (!question.phase) {
            missing.push("phase");
        }

        if (!question.subject) {
            missing.push("subject");
        }

        if (!question.element) {
            missing.push("element");
        }

        if (!question.cpId && !question.tpId) {
            missing.push("cpId/tpId");
        }

        if (!question.indicator) {
            missing.push("indicator");
        }

        const cldDimensions =
            question.cld?.map((x) => x.dimension) ?? [];

        const cldEvidence =
            question.cld?.map((x) => x.evidence) ?? [];

        const kbcValues = [
            ...(question.kbc?.values ?? []),
            ...(question.kbc?.secondary ?? [])
        ];

        return {
            curriculum: {
                valid: missing.length === 0,
                missing
            },

            cld: {
                valid:
                    cldDimensions.length > 0 &&
                    cldEvidence.every(Boolean),
                dimensions: cldDimensions,
                evidence: cldEvidence
            },

            kbc: {
                valid:
                    !!question.kbc &&
                    !!question.kbc.evidence,
                values: kbcValues,
                evidence: question.kbc?.evidence
            }
        };
    }
}
