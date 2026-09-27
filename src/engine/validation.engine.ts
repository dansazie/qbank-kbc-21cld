import type {
    Question,
    QuestionOption
} from "../types/question.js";

export interface ValidationError {
    code: string;
    field: string;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    publishable: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
}

export class QuestionValidationEngine {

    validate(
        question: Question
    ): ValidationResult {

        const errors: ValidationError[] = [];
        const warnings: ValidationError[] = [];

        this.requiredFields(
            question,
            errors
        );

        this.validateOptions(
            question,
            errors
        );

        this.validateAnswer(
            question,
            errors
        );

        this.validateAssessment(
            question,
            errors
        );

        this.validateTraceability(
            question,
            errors
        );

        this.validateCLD(
            question,
            errors,
            warnings
        );

        this.validateKBC(
            question,
            errors,
            warnings
        );

        this.validateQuality(
            question,
            errors
        );

        const valid =
            errors.length === 0;

        const publishable =
            valid &&
            question.status !== "draft" &&
            question.qualityControl.contentValidity ===
            "pass" &&
            question.qualityControl.constructValidity ===
            "pass" &&
            question.qualityControl.languageQuality ===
            "pass" &&
            question.qualityControl.biasCheck ===
            "pass";

        return {
            valid,
            publishable,
            errors,
            warnings
        };
    }

    private requiredFields(
        q: Question,
        errors: ValidationError[]
    ): void {

        const required: Array<
            keyof Question
        > = [
                "questionId",
                "version",
                "status",
                "phase",
                "subject",
                "element",
                "materialScope",
                "indicator",
                "assessment",
                "cognitiveLevel",
                "questionType",
                "stem",
                "qualityControl",
                "createdAt",
                "updatedAt"
            ];

        for (const field of required) {

            const value = q[field];

            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                errors.push({
                    code: "REQUIRED_FIELD",
                    field: String(field),
                    message:
                        `Field ${String(field)} wajib diisi.`
                });
            }
        }
    }

    private validateOptions(
        q: Question,
        errors: ValidationError[]
    ): void {

        const optionTypes = [
            "MCQ",
            "MCMA"
        ];

        if (
            !optionTypes.includes(
                q.questionType
            )
        ) {
            return;
        }

        if (
            !q.options ||
            q.options.length < 2
        ) {
            errors.push({
                code: "OPTIONS_REQUIRED",
                field: "options",
                message:
                    "Soal pilihan harus memiliki minimal dua opsi."
            });

            return;
        }

        const ids =
            new Set<string>();

        for (
            const option of
            q.options as QuestionOption[]
        ) {

            if (ids.has(option.id)) {

                errors.push({
                    code: "DUPLICATE_OPTION_ID",
                    field: "options",
                    message:
                        `ID opsi ${option.id} duplikat.`
                });
            }

            ids.add(option.id);

            if (
                !option.text ||
                !option.text.trim()
            ) {

                errors.push({
                    code: "EMPTY_OPTION",
                    field: "options",
                    message:
                        `Opsi ${option.id} kosong.`
                });
            }
        }

        if (
            q.questionType === "MCQ" &&
            Array.isArray(q.answer)
        ) {

            errors.push({
                code: "MCQ_MULTIPLE_ANSWER",
                field: "answer",
                message:
                    "MCQ hanya boleh memiliki satu jawaban."
            });
        }
    }

    private validateAnswer(
        q: Question,
        errors: ValidationError[]
    ): void {

        const requiresAnswer = [
            "MCQ",
            "MCMA",
            "TRUE_FALSE",
            "MATCHING",
            "SHORT_ANSWER",
            "ESSAY"
        ];

        if (
            requiresAnswer.includes(
                q.questionType
            ) &&
            (
                q.answer === undefined ||
                q.answer === null ||
                q.answer === ""
            )
        ) {

            errors.push({
                code: "ANSWER_REQUIRED",
                field: "answer",
                message:
                    "Kunci jawaban wajib tersedia."
            });

            return;
        }

        if (
            ["MCQ", "TRUE_FALSE"]
                .includes(q.questionType) &&
            typeof q.answer === "string" &&
            q.options
        ) {

            const validIds =
                new Set(
                    q.options.map(
                        option => option.id
                    )
                );

            if (
                !validIds.has(q.answer)
            ) {

                errors.push({
                    code: "INVALID_ANSWER",
                    field: "answer",
                    message:
                        "Kunci jawaban tidak terdapat dalam opsi."
                });
            }
        }

        if (
            q.questionType === "MCMA" &&
            Array.isArray(q.answer) &&
            q.options
        ) {

            const validIds =
                new Set(
                    q.options.map(
                        option => option.id
                    )
                );

            for (
                const answer of q.answer
            ) {

                if (
                    !validIds.has(answer)
                ) {

                    errors.push({
                        code: "INVALID_ANSWER",
                        field: "answer",
                        message:
                            `Jawaban ${answer} tidak terdapat dalam opsi.`
                    });
                }
            }
        }
    }

    private validateAssessment(
        q: Question,
        errors: ValidationError[]
    ): void {

        if (
            !q.assessment?.purpose
        ) {

            errors.push({
                code: "ASSESSMENT_PURPOSE_REQUIRED",
                field: "assessment.purpose",
                message:
                    "Tujuan asesmen wajib ditentukan."
            });
        }

        if (
            !q.assessment?.domains ||
            q.assessment.domains.length === 0
        ) {

            errors.push({
                code: "ASSESSMENT_DOMAIN_REQUIRED",
                field: "assessment.domains",
                message:
                    "Domain asesmen wajib ditentukan."
            });
        }

        if (
            !q.assessment?.evidence
        ) {

            errors.push({
                code: "ASSESSMENT_EVIDENCE_REQUIRED",
                field: "assessment.evidence",
                message:
                    "Bukti asesmen wajib ditentukan."
            });
        }
    }

    private validateTraceability(
        q: Question,
        errors: ValidationError[]
    ): void {

        if (
            !q.cpId &&
            !q.tpId
        ) {

            errors.push({
                code: "NO_CURRICULUM_TRACE",
                field: "cpId/tpId",
                message:
                    "Soal harus dapat ditelusuri minimal ke CP atau TP."
            });
        }

        if (
            !q.indicator ||
            !q.indicator.trim()
        ) {

            errors.push({
                code: "INDICATOR_REQUIRED",
                field: "indicator",
                message:
                    "Indikator soal wajib diisi."
            });
        }

        if (
            !q.materialScope ||
            !q.materialScope.trim()
        ) {

            errors.push({
                code: "MATERIAL_REQUIRED",
                field: "materialScope",
                message:
                    "Lingkup materi wajib diisi."
            });
        }
    }

    private validateCLD(
        q: Question,
        errors: ValidationError[],
        warnings: ValidationError[]
    ): void {

        if (
            !q.cld ||
            q.cld.length === 0
        ) {

            warnings.push({
                code: "NO_21CLD",
                field: "cld",
                message:
                    "Soal belum memiliki pemetaan 21CLD."
            });

            return;
        }

        const dimensions =
            new Set<string>();

        for (
            const mapping of q.cld
        ) {

            if (
                dimensions.has(
                    mapping.dimension
                )
            ) {

                warnings.push({
                    code: "DUPLICATE_CLD_DIMENSION",
                    field: "cld",
                    message:
                        `Dimensi ${mapping.dimension} muncul lebih dari satu kali.`
                });
            }

            dimensions.add(
                mapping.dimension
            );

            if (
                !mapping.dimension
            ) {

                errors.push({
                    code: "CLD_DIMENSION_REQUIRED",
                    field: "cld.dimension",
                    message:
                        "Dimensi 21CLD wajib ditentukan."
                });
            }

            if (
                !mapping.evidence
            ) {

                errors.push({
                    code: "CLD_EVIDENCE_REQUIRED",
                    field: "cld.evidence",
                    message:
                        "Pemetaan 21CLD harus memiliki bukti."
                });
            }
        }
    }

    private validateKBC(
        q: Question,
        errors: ValidationError[],
        warnings: ValidationError[]
    ): void {

        if (!q.kbc) {

            warnings.push({
                code: "NO_KBC",
                field: "kbc",
                message:
                    "Soal belum memiliki pemetaan KBC."
            });

            return;
        }

        if (
            !q.kbc.primary &&
            (
                !q.kbc.secondary ||
                q.kbc.secondary.length === 0
            )
        ) {

            errors.push({
                code: "KBC_MAPPING_REQUIRED",
                field: "kbc",
                message:
                    "Pemetaan KBC harus memiliki nilai utama atau sekunder."
            });
        }

        if (
            !q.kbc.evidence
        ) {

            errors.push({
                code: "KBC_EVIDENCE_REQUIRED",
                field: "kbc.evidence",
                message:
                    "Pemetaan KBC harus memiliki bukti implementasi."
            });
        }
    }

    private validateQuality(
        q: Question,
        errors: ValidationError[]
    ): void {

        if (!q.qualityControl) {

            errors.push({
                code: "QUALITY_CONTROL_REQUIRED",
                field: "qualityControl",
                message:
                    "Quality control wajib tersedia."
            });

            return;
        }

        const fields = [
            "contentValidity",
            "constructValidity",
            "languageQuality",
            "biasCheck"
        ] as const;

        for (const field of fields) {

            if (
                !q.qualityControl[field]
            ) {

                errors.push({
                    code: "QC_FIELD_REQUIRED",
                    field:
                        `qualityControl.${field}`,
                    message:
                        `QC ${field} wajib diisi.`
                });
            }
        }
    }
}
