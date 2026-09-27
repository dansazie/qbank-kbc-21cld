import type {
    CognitiveLevel,
    Question,
    QuestionType
} from "../types/question.js";

export interface BlueprintRule {

    phase?: string;

    grade?: number;

    subject?: string;

    count: number;

    cognitive?: Partial<
        Record<CognitiveLevel, number>
    >;

    questionTypes?: Partial<
        Record<QuestionType, number>
    >;

    cld?: Partial<
        Record<string, number>
    >;

    kbc?: Partial<
        Record<string, number>
    >;

    difficulty?: Partial<
        Record<
            "easy" | "medium" | "hard",
            number
        >
    >;
}

export interface BlueprintShortage {

    dimension: string;

    requested: number;

    available: number;
}

export interface BlueprintResult {

    selected: Question[];

    rejected: Question[];

    fulfilled: {

        total: number;

        cognitive: Record<
            string,
            number
        >;

        questionTypes: Record<
            string,
            number
        >;

        cld: Record<
            string,
            number
        >;

        kbc: Record<
            string,
            number
        >;

        difficulty: Record<
            string,
            number
        >;
    };

    shortages: BlueprintShortage[];

    complete: boolean;
}

export class BlueprintEngine {

    build(
        questions: Question[],
        rule: BlueprintRule
    ): BlueprintResult {

        let pool = [
            ...questions
        ];

        pool =
            this.applyBasicFilters(
                pool,
                rule
            );

        const selected: Question[] = [];

        /*
         * Pemilihan berdasarkan distribusi
         *
         * Urutan:
         * 1. Cognitive level
         * 2. Question type
         * 3. Difficulty
         */

        this.selectByDistribution(
            pool,
            selected,
            rule.cognitive
        );

        this.selectByDistribution(
            pool,
            selected,
            rule.questionTypes
        );

        this.selectByDistribution(
            pool,
            selected,
            rule.difficulty
        );

        /*
         * Jika target jumlah belum tercapai,
         * isi dengan soal lain yang tersedia.
         */

        if (
            selected.length <
            rule.count
        ) {

            for (
                const question of pool
            ) {

                if (
                    selected.length >=
                    rule.count
                ) {
                    break;
                }

                if (
                    !selected.includes(
                        question
                    )
                ) {

                    selected.push(
                        question
                    );
                }
            }
        }

        const finalSelected =
            selected.slice(
                0,
                rule.count
            );

        const rejected =
            pool.filter(
                question =>
                    !finalSelected.includes(
                        question
                    )
            );

        const fulfilled =
            this.calculateDistribution(
                finalSelected
            );

        const shortages =
            this.calculateShortages(
                pool,
                rule,
                fulfilled
            );

        const complete =
            finalSelected.length ===
            rule.count &&
            shortages.length === 0;

        return {

            selected:
                finalSelected,

            rejected,

            fulfilled,

            shortages,

            complete
        };
    }

    private applyBasicFilters(
        questions: Question[],
        rule: BlueprintRule
    ): Question[] {

        return questions.filter(
            question => {

                if (
                    rule.phase &&
                    question.phase !==
                    rule.phase
                ) {

                    return false;
                }

                if (
                    rule.grade &&
                    question.grade !==
                    rule.grade
                ) {

                    return false;
                }

                if (
                    rule.subject &&
                    question.subject !==
                    rule.subject
                ) {

                    return false;
                }

                return true;
            }
        );
    }

    private selectByDistribution<
        T extends string
    >(
        pool: Question[],
        selected: Question[],
        distribution:
            | Partial<Record<T, number>>
            | undefined
    ): void {

        if (
            !distribution
        ) {

            return;
        }

        /*
         * Object.entries() pada generic Partial<Record<...>>
         * dapat menghasilkan value bertipe unknown.
         *
         * Karena BlueprintRule mendefinisikan semua nilai
         * distribution sebagai number, kita normalisasi
         * secara eksplisit di sini.
         */

        for (
            const [
                key,
                rawCount
            ] of Object.entries(
                distribution
            )
        ) {

            const count =
                Number(rawCount);

            if (
                !Number.isFinite(
                    count
                ) ||
                count <= 0
            ) {

                continue;
            }

            const candidates =
                pool.filter(
                    question => {

                        /*
                         * Jangan memilih soal yang
                         * sudah dipilih sebelumnya.
                         */

                        if (
                            selected.includes(
                                question
                            )
                        ) {

                            return false;
                        }

                        /*
                         * Cognitive level
                         */

                        if (
                            this.isCognitiveLevel(
                                key
                            )
                        ) {

                            return (
                                question.cognitiveLevel ===
                                key
                            );
                        }

                        /*
                         * Question type
                         */

                        if (
                            this.isQuestionType(
                                key
                            )
                        ) {

                            return (
                                question.questionType ===
                                key
                            );
                        }

                        /*
                         * Difficulty
                         */

                        if (
                            key === "easy" ||
                            key === "medium" ||
                            key === "hard"
                        ) {

                            return (
                                question.difficulty ===
                                key
                            );
                        }

                        return false;
                    }
                );

            selected.push(
                ...candidates.slice(
                    0,
                    count
                )
            );
        }
    }

    private calculateDistribution(
        questions: Question[]
    ) {

        const cognitive:
            Record<string, number> =
            {};

        const questionTypes:
            Record<string, number> =
            {};

        const cld:
            Record<string, number> =
            {};

        const kbc:
            Record<string, number> =
            {};

        const difficulty:
            Record<string, number> =
            {};

        for (
            const question of questions
        ) {

            /*
             * Cognitive level
             */

            cognitive[
                question.cognitiveLevel
            ] =
                (
                    cognitive[
                    question.cognitiveLevel
                    ] ?? 0
                ) + 1;

            /*
             * Question type
             */

            questionTypes[
                question.questionType
            ] =
                (
                    questionTypes[
                    question.questionType
                    ] ?? 0
                ) + 1;

            /*
             * Difficulty
             */

            if (
                question.difficulty
            ) {

                difficulty[
                    question.difficulty
                ] =
                    (
                        difficulty[
                        question.difficulty
                        ] ?? 0
                    ) + 1;
            }

            /*
             * 21CLD
             */

            for (
                const mapping
                of question.cld ?? []
            ) {

                cld[
                    mapping.dimension
                ] =
                    (
                        cld[
                        mapping.dimension
                        ] ?? 0
                    ) + 1;
            }

            /*
             * KBC
             */

            if (
                question.kbc?.primary
            ) {

                kbc[
                    question.kbc.primary
                ] =
                    (
                        kbc[
                        question.kbc.primary
                        ] ?? 0
                    ) + 1;
            }
        }

        return {

            total:
                questions.length,

            cognitive,

            questionTypes,

            cld,

            kbc,

            difficulty
        };
    }

    private calculateShortages(
        pool: Question[],
        rule: BlueprintRule,
        fulfilled: ReturnType<
            BlueprintEngine[
            "calculateDistribution"
            ]
        >
    ): BlueprintShortage[] {

        const shortages:
            BlueprintShortage[] =
            [];

        /*
         * Parameter fulfilled sengaja diterima
         * karena akan digunakan untuk memastikan
         * hasil blueprint yang benar-benar terpenuhi.
         *
         * Saat ini beberapa shortage dihitung
         * berdasarkan ketersediaan pool.
         */

        void fulfilled;

        const check = (
            dimension: string,
            requested: number,
            available: number
        ) => {

            if (
                available <
                requested
            ) {

                shortages.push({

                    dimension,

                    requested,

                    available
                });
            }
        };

        /*
         * Cognitive level
         */

        for (
            const [
                level,
                rawRequested
            ] of Object.entries(
                rule.cognitive ?? {}
            )
        ) {

            const requested =
                Number(
                    rawRequested
                );

            const available =
                pool.filter(
                    question =>
                        question.cognitiveLevel ===
                        level
                ).length;

            check(
                `cognitive.${level}`,
                requested,
                available
            );
        }

        /*
         * Question type
         */

        for (
            const [
                type,
                rawRequested
            ] of Object.entries(
                rule.questionTypes ?? {}
            )
        ) {

            const requested =
                Number(
                    rawRequested
                );

            const available =
                pool.filter(
                    question =>
                        question.questionType ===
                        type
                ).length;

            check(
                `questionType.${type}`,
                requested,
                available
            );
        }

        /*
         * Difficulty
         */

        for (
            const [
                level,
                rawRequested
            ] of Object.entries(
                rule.difficulty ?? {}
            )
        ) {

            const requested =
                Number(
                    rawRequested
                );

            const available =
                pool.filter(
                    question =>
                        question.difficulty ===
                        level
                ).length;

            check(
                `difficulty.${level}`,
                requested,
                available
            );
        }

        /*
         * Total questions
         */

        if (
            pool.length <
            rule.count
        ) {

            check(
                "total",
                rule.count,
                pool.length
            );
        }

        return shortages;
    }

    private isCognitiveLevel(
        value: string
    ): value is CognitiveLevel {

        return [
            "C1",
            "C2",
            "C3",
            "C4",
            "C5",
            "C6"
        ].includes(
            value
        );
    }

    private isQuestionType(
        value: string
    ): value is QuestionType {

        return [
            "MCQ",
            "MCMA",
            "TRUE_FALSE",
            "MATCHING",
            "SHORT_ANSWER",
            "ESSAY",
            "PERFORMANCE",
            "PROJECT"
        ].includes(
            value
        );
    }
}
