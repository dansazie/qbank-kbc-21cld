import type {
    Question
} from "../types/question.js";

import {
    QuestionRepository,
    type QuestionFilter
} from "../repositories/question.repository.js";

import {
    QuestionValidationEngine
} from "../engine/validation.engine.js";

import {
    MappingEngine
} from "../engine/mapping.engine.js";

export class QuestionService {

    constructor(
        private readonly repository =
            new QuestionRepository(),

        private readonly validator =
            new QuestionValidationEngine(),

        private readonly mapper =
            new MappingEngine()
    ) { }

    getAll(): Question[] {
        return this.repository.findAll();
    }

    getById(
        id: string
    ): Question | undefined {
        return this.repository.findById(id);
    }

    search(
        filter: QuestionFilter
    ): Question[] {
        return this.repository.search(
            filter
        );
    }

    validate(
        question: Question
    ) {
        return this.validator.validate(
            question
        );
    }

    mapping(
        question: Question
    ) {
        return this.mapper.inspect(
            question
        );
    }

    validateAll() {

        return this.getAll().map(
            question => ({
                questionId:
                    question.questionId,

                result:
                    this.validator.validate(
                        question
                    )
            })
        );
    }

    statistics() {

        const questions =
            this.getAll();

        return {
            total:
                questions.length,

            byPhase:
                this.group(
                    questions,
                    q => q.phase
                ),

            bySubject:
                this.group(
                    questions,
                    q => q.subject
                ),

            byCognitiveLevel:
                this.group(
                    questions,
                    q => q.cognitiveLevel
                ),

            byType:
                this.group(
                    questions,
                    q => q.questionType
                ),

            byStatus:
                this.group(
                    questions,
                    q => q.status
                ),

            byDifficulty:
                this.group(
                    questions,
                    q => q.difficulty ?? "unset"
                ),

            byCLD:
                this.groupCLD(
                    questions
                ),

            byKBC:
                this.groupKBC(
                    questions
                )
        };
    }

    private group<T>(
        items: Question[],
        selector: (
            item: Question
        ) => T
    ): Record<string, number> {

        return items.reduce<
            Record<string, number>
        >(
            (
                result,
                item
            ) => {

                const key =
                    String(
                        selector(item)
                    );

                result[key] =
                    (
                        result[key] ?? 0
                    ) + 1;

                return result;
            },
            {}
        );
    }

    private groupCLD(
        questions: Question[]
    ): Record<string, number> {

        const result:
            Record<string, number> = {};

        for (
            const question of questions
        ) {

            for (
                const mapping
                of question.cld ?? []
            ) {

                result[
                    mapping.dimension
                ] =
                    (
                        result[
                        mapping.dimension
                        ] ?? 0
                    ) + 1;
            }
        }

        return result;
    }

    private groupKBC(
        questions: Question[]
    ): Record<string, number> {

        const result:
            Record<string, number> = {};

        for (
            const question of questions
        ) {

            const primary =
                question.kbc?.primary;

            if (!primary) {
                continue;
            }

            result[primary] =
                (
                    result[primary] ?? 0
                ) + 1;
        }

        return result;
    }
}
