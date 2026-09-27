import type {
    CognitiveLevel,
    Question,
    QuestionType
} from "./question.js";

export type Difficulty =
    | "easy"
    | "medium"
    | "hard";

export interface DistributionRule {
    cognitive?: Partial<
        Record<CognitiveLevel, number>
    >;

    questionTypes?: Partial<
        Record<QuestionType, number>
    >;

    difficulty?: Partial<
        Record<Difficulty, number>
    >;

    cld?: Partial<
        Record<string, number>
    >;

    kbc?: Partial<
        Record<string, number>
    >;
}

export interface BlueprintRuleV2
    extends DistributionRule {

    blueprintId?: string;

    name?: string;

    count: number;

    phase?: string;

    grade?: number;

    subject?: string;

    element?: string;

    curriculumId?: string;

    cpId?: string;

    tpId?: string;

    status?: string;

    allowFallback?: boolean;

    requireAllConstraints?: boolean;

    /**
     * Mengaktifkan pengacakan kandidat soal.
     *
     * Jika true, pool soal akan diacak sebelum
     * proses pemilihan dilakukan.
     */
    randomize?: boolean;

    /**
     * Seed opsional untuk menghasilkan urutan
     * yang deterministik/reproducible.
     *
     * Seed yang sama dengan pool dan blueprint
     * yang sama akan menghasilkan urutan yang sama.
     */
    seed?: string | number;
}

export interface BlueprintShortage {
    dimension: string;

    requested: number;

    available: number;

    selected: number;
}

export interface BlueprintFulfillment {
    total: number;

    cognitive:
    Record<string, number>;

    questionTypes:
    Record<string, number>;

    difficulty:
    Record<string, number>;

    cld:
    Record<string, number>;

    kbc:
    Record<string, number>;
}

export interface BlueprintResultV2 {

    blueprintId?: string;

    selected: Question[];

    rejected: Question[];

    fulfilled: BlueprintFulfillment;

    shortages: BlueprintShortage[];

    complete: boolean;

    score: number;

    warnings: string[];
}
