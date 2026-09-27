import type {
    Question
} from "../types/question.js";

import type {
    BlueprintRuleV2,
    BlueprintResultV2,
    BlueprintShortage,
    BlueprintFulfillment,
    Difficulty
} from "../types/blueprint.js";

export class BlueprintEngineV2 {

    build(
        questions: Question[],
        rule: BlueprintRuleV2
    ): BlueprintResultV2 {

        this.assertRule(rule);

        const pool =
            questions.filter(
                question =>
                    this.matchesBasicFilters(
                        question,
                        rule
                    )
            );

        const selected:
            Question[] = [];

        const random =
            this.createRandom(
                rule.seed
            );

        const remaining =
            rule.randomize
                ? this.shuffle(
                    [...pool],
                    random
                )
                : [...pool];

        while (
            selected.length <
            rule.count &&
            remaining.length > 0
        ) {

            const ranked =
                remaining
                    .map(
                        question => ({
                            question,
                            score:
                                this.scoreCandidate(
                                    question,
                                    selected,
                                    rule
                                )
                        })
                    )
                    .sort(
                        (a, b) =>
                            b.score -
                            a.score
                    );

            const candidate =
                ranked[0];

            if (!candidate) {
                break;
            }

            selected.push(
                candidate.question
            );

            const index =
                remaining.indexOf(
                    candidate.question
                );

            if (index >= 0) {
                remaining.splice(
                    index,
                    1
                );
            }
        }

        const fulfilled =
            this.calculateDistribution(
                selected
            );

        const shortages =
            this.calculateShortages(
                pool,
                selected,
                rule
            );

        const complete =
            selected.length ===
            rule.count &&
            shortages.length === 0;

        const warnings:
            string[] = [];

        if (
            selected.length <
            rule.count
        ) {
            warnings.push(
                `Hanya ${selected.length} dari ${rule.count} soal yang tersedia.`
            );
        }

        if (
            shortages.length > 0
        ) {
            warnings.push(
                "Sebagian constraint blueprint tidak terpenuhi."
            );
        }

        const rejected =
            pool.filter(
                question =>
                    !selected.includes(
                        question
                    )
            );

        const score =
            this.calculateScore(
                selected,
                rule
            );

        return {

            blueprintId:
                rule.blueprintId,

            selected,

            rejected,

            fulfilled,

            shortages,

            complete,

            score,

            warnings
        };
    }

    private assertRule(
        rule: BlueprintRuleV2
    ): void {

        if (
            !Number.isInteger(
                rule.count
            ) ||
            rule.count <= 0
        ) {

            throw new Error(
                "Blueprint count harus berupa integer lebih besar dari 0."
            );
        }

        this.assertDistributionTotal(
            "cognitive",
            rule.cognitive,
            rule.count
        );

        this.assertDistributionTotal(
            "questionTypes",
            rule.questionTypes,
            rule.count
        );

        this.assertDistributionTotal(
            "difficulty",
            rule.difficulty,
            rule.count
        );

        if (
            rule.randomize !== undefined &&
            typeof rule.randomize !==
            "boolean"
        ) {
            throw new Error(
                "Blueprint randomize harus berupa boolean."
            );
        }

        if (
            rule.seed !== undefined &&
            typeof rule.seed !== "string" &&
            typeof rule.seed !== "number"
        ) {
            throw new Error(
                "Blueprint seed harus berupa string atau number."
            );
        }
    }

    private assertDistributionTotal(
        name: string,
        distribution:
            Partial<
                Record<string, number>
            > | undefined,
        count: number
    ): void {
        if (!distribution) {
            return;
        }

        let total = 0;

        for (
            const value of Object.values(
                distribution
            )
        ) {
            if (
                typeof value === "number"
            ) {
                total += value;
            }
        }

        if (
            total > count
        ) {
            throw new Error(
                `Total distribution '${name}' (${total}) tidak boleh melebihi count (${count}).`
            );
        }
    }



    private matchesBasicFilters(
        question: Question,
        rule: BlueprintRuleV2
    ): boolean {

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

        if (
            rule.element &&
            question.element !==
            rule.element
        ) {
            return false;
        }

        if (
            rule.curriculumId &&
            question.curriculumId !==
            rule.curriculumId
        ) {
            return false;
        }

        if (
            rule.cpId &&
            question.cpId !==
            rule.cpId
        ) {
            return false;
        }

        if (
            rule.tpId &&
            question.tpId !==
            rule.tpId
        ) {
            return false;
        }

        if (
            rule.status &&
            question.status !==
            rule.status
        ) {
            return false;
        }

        return true;
    }

    private scoreCandidate(
        question: Question,
        selected: Question[],
        rule: BlueprintRuleV2
    ): number {

        let score = 0;

        if (
            rule.cognitive
        ) {

            score +=
                this.distributionScore(
                    question.cognitiveLevel,
                    selected.map(
                        q =>
                            q.cognitiveLevel
                    ),
                    rule.cognitive
                );
        }

        if (
            rule.questionTypes
        ) {

            score +=
                this.distributionScore(
                    question.questionType,
                    selected.map(
                        q =>
                            q.questionType
                    ),
                    rule.questionTypes
                );
        }

        if (
            rule.difficulty
        ) {

            const selectedDifficulty:
                string[] =
                selected
                    .map(
                        q =>
                            q.difficulty
                    )
                    .filter(
                        (
                            value
                        ): value is Difficulty =>
                            value !==
                            undefined
                    );

            score +=
                this.distributionScore(
                    question.difficulty,
                    selectedDifficulty,
                    rule.difficulty
                );
        }

        if (
            rule.cld
        ) {

            const selectedCLD:
                string[] =
                selected.flatMap(
                    q =>
                        (
                            q.cld ?? []
                        ).map(
                            mapping =>
                                mapping.dimension
                        )
                );

            for (
                const mapping
                of question.cld ?? []
            ) {

                score +=
                    this.distributionScore(
                        mapping.dimension,
                        selectedCLD,
                        rule.cld
                    );
            }
        }

        if (
            rule.kbc
        ) {

            const primary =
                question.kbc?.primary;

            if (primary) {

                const selectedKBC:
                    string[] =
                    selected
                        .map(
                            q =>
                                q.kbc?.primary
                        )
                        .filter(
                            (
                                value
                            ): value is string =>
                                value !==
                                undefined
                        );

                score +=
                    this.distributionScore(
                        primary,
                        selectedKBC,
                        rule.kbc
                    );
            }
        }

        return score;
    }

    private distributionScore(
        value:
            string |
            undefined,

        current:
            string[],

        requested:
            Partial<
                Record<string, number>
            >
    ): number {

        if (
            !value ||
            requested[value] ===
            undefined
        ) {

            return 0;
        }

        const target =
            requested[value] ?? 0;

        const used =
            current.filter(
                item =>
                    item === value
            ).length;

        if (
            used >= target
        ) {

            return 0;
        }

        return (
            target -
            used
        );
    }

    private calculateDistribution(
        questions: Question[]
    ): BlueprintFulfillment {

        const cognitive:
            Record<string, number> = {};

        const questionTypes:
            Record<string, number> = {};

        const difficulty:
            Record<string, number> = {};

        const cld:
            Record<string, number> = {};

        const kbc:
            Record<string, number> = {};

        for (
            const question
            of questions
        ) {

            this.increment(
                cognitive,
                question.cognitiveLevel
            );

            this.increment(
                questionTypes,
                question.questionType
            );

            if (
                question.difficulty
            ) {

                this.increment(
                    difficulty,
                    question.difficulty
                );
            }

            for (
                const mapping
                of question.cld ?? []
            ) {

                this.increment(
                    cld,
                    mapping.dimension
                );
            }

            const primary =
                question.kbc?.primary;

            if (primary) {

                this.increment(
                    kbc,
                    primary
                );
            }
        }

        return {
            total:
                questions.length,

            cognitive,

            questionTypes,

            difficulty,

            cld,

            kbc
        };
    }

    private increment(
        target:
            Record<string, number>,

        key:
            string
    ): void {

        target[key] =
            (
                target[key] ??
                0
            ) + 1;
    }

    private calculateShortages(
        pool: Question[],
        selected: Question[],
        rule: BlueprintRuleV2
    ): BlueprintShortage[] {

        const shortages:
            BlueprintShortage[] = [];

        this.checkDistributionShortage(
            shortages,
            "cognitive",
            rule.cognitive,
            pool.map(
                q =>
                    q.cognitiveLevel
            ),
            selected.map(
                q =>
                    q.cognitiveLevel
            )
        );

        this.checkDistributionShortage(
            shortages,
            "questionType",
            rule.questionTypes,
            pool.map(
                q =>
                    q.questionType
            ),
            selected.map(
                q =>
                    q.questionType
            )
        );

        this.checkDistributionShortage(
            shortages,
            "difficulty",
            rule.difficulty,
            pool
                .map(
                    q =>
                        q.difficulty
                )
                .filter(
                    (
                        value
                    ): value is Difficulty =>
                        value !==
                        undefined
                ),
            selected
                .map(
                    q =>
                        q.difficulty
                )
                .filter(
                    (
                        value
                    ): value is Difficulty =>
                        value !==
                        undefined
                )
        );

        this.checkDistributionShortage(
            shortages,
            "cld",
            rule.cld,
            pool.flatMap(
                q =>
                    (
                        q.cld ?? []
                    ).map(
                        mapping =>
                            mapping.dimension
                    )
            ),
            selected.flatMap(
                q =>
                    (
                        q.cld ?? []
                    ).map(
                        mapping =>
                            mapping.dimension
                    )
            )
        );

        this.checkDistributionShortage(
            shortages,
            "kbc",
            rule.kbc,
            pool
                .map(
                    q =>
                        q.kbc?.primary
                )
                .filter(
                    (
                        value
                    ): value is string =>
                        value !==
                        undefined
                ),
            selected
                .map(
                    q =>
                        q.kbc?.primary
                )
                .filter(
                    (
                        value
                    ): value is string =>
                        value !==
                        undefined
                )
        );

        if (
            pool.length <
            rule.count
        ) {

            shortages.push({

                dimension:
                    "total",

                requested:
                    rule.count,

                available:
                    pool.length,

                selected:
                    selected.length
            });
        }

        return shortages;
    }

    private checkDistributionShortage(
        shortages:
            BlueprintShortage[],

        prefix:
            string,

        requested:
            Partial<
                Record<string, number>
            > | undefined,

        availableValues:
            string[],

        selectedValues:
            string[]
    ): void {

        if (!requested) {
            return;
        }

        for (
            const [
                key,
                rawRequested
            ] of Object.entries(
                requested
            )
        ) {

            const requestedCount =
                Number(
                    rawRequested
                );

            const available =
                availableValues.filter(
                    value =>
                        value === key
                ).length;

            const selected =
                selectedValues.filter(
                    value =>
                        value === key
                ).length;

            if (
                available <
                requestedCount
            ) {

                shortages.push({

                    dimension:
                        `${prefix}.${key}`,

                    requested:
                        requestedCount,

                    available,

                    selected
                });

                continue;
            }

            if (
                selected <
                requestedCount
            ) {

                shortages.push({

                    dimension:
                        `${prefix}.${key}`,

                    requested:
                        requestedCount,

                    available,

                    selected
                });
            }
        }
    }

    private calculateScore(
        selected:
            Question[],

        rule:
            BlueprintRuleV2
    ): number {

        let requestedTotal = 0;

        let fulfilledTotal = 0;

        const countDistribution =
            (
                requested:
                    Partial<
                        Record<string, number>
                    > | undefined,

                values:
                    string[]
            ) => {

                if (!requested) {
                    return;
                }

                for (
                    const [
                        key,
                        rawTarget
                    ] of Object.entries(
                        requested
                    )
                ) {

                    const target =
                        Number(
                            rawTarget
                        );

                    requestedTotal +=
                        target;

                    fulfilledTotal +=
                        Math.min(
                            target,
                            values.filter(
                                value =>
                                    value ===
                                    key
                            ).length
                        );
                }
            };

        countDistribution(
            rule.cognitive,
            selected.map(
                q =>
                    q.cognitiveLevel
            )
        );

        countDistribution(
            rule.questionTypes,
            selected.map(
                q =>
                    q.questionType
            )
        );

        countDistribution(
            rule.difficulty,
            selected
                .map(
                    q =>
                        q.difficulty
                )
                .filter(
                    (
                        value
                    ): value is Difficulty =>
                        value !==
                        undefined
                )
        );

        countDistribution(
            rule.cld,
            selected.flatMap(
                q =>
                    (
                        q.cld ?? []
                    ).map(
                        mapping =>
                            mapping.dimension
                    )
            )
        );

        countDistribution(
            rule.kbc,
            selected
                .map(
                    q =>
                        q.kbc?.primary
                )
                .filter(
                    (
                        value
                    ): value is string =>
                        value !==
                        undefined
                )
        );

        if (
            requestedTotal === 0
        ) {

            return 100;
        }

        return Math.round(
            (
                fulfilledTotal /
                requestedTotal
            ) * 100
        );
    }

    private createRandom(
        seed?: string | number
    ): () => number {

        if (
            seed === undefined
        ) {
            return Math.random;
        }

        const input =
            String(seed);

        let state =
            2166136261;

        for (
            let index = 0;
            index < input.length;
            index++
        ) {

            state ^=
                input.charCodeAt(
                    index
                );

            state =
                Math.imul(
                    state,
                    16777619
                );
        }

        return () => {

            state +=
                0x6D2B79F5;

            let value =
                state;

            value =
                Math.imul(
                    value ^
                    (value >>> 15),
                    value | 1
                );

            value ^=
                value +
                Math.imul(
                    value ^
                    (value >>> 7),
                    value | 61
                );

            return (
                (
                    value ^
                    (value >>> 14)
                ) >>> 0
            ) / 4294967296;
        };
    }

    private shuffle<T>(
        values: T[],
        random: () => number
    ): T[] {

        for (
            let index =
                values.length - 1;
            index > 0;
            index--
        ) {

            const swapIndex =
                Math.floor(
                    random() *
                    (index + 1)
                );

            [
                values[index],
                values[swapIndex]
            ] = [
                    values[swapIndex],
                    values[index]
                ];
        }

        return values;
    }
}
