import type {
    Question
} from "../types/question.js";

import {
    QuestionRepository
} from "../repositories/question.repository.js";

import {
    QuestionValidationEngine
} from "../engine/validation.engine.js";

import {
    ScoringEngine,
    type StudentAnswer,
    type ScoreResult
} from "../engine/scoring.engine.js";

export class QuestionService {

    private readonly repository:
        QuestionRepository;

    private readonly validator:
        QuestionValidationEngine;

    private readonly scorer:
        ScoringEngine;

    constructor(
        repository =
            new QuestionRepository()
    ) {
        this.repository =
            repository;

        this.validator =
            new QuestionValidationEngine();

        this.scorer =
            new ScoringEngine();
    }

    getAll(): Question[] {
        return this.repository.getAll();
    }

    getById(
        questionId: string
    ): Question | undefined {
        return this.repository.getById(
            questionId
        );
    }

    validateQuestion(
        question: Question
    ) {
        return this.validator.validate(
            question
        );
    }

    validateAll() {
        return this.getAll().map(
            question => ({
                questionId:
                    question.questionId,

                result:
                    this.validateQuestion(
                        question
                    )
            })
        );
    }

    create(
        question: Question
    ): Question {

        const existing =
            this.getById(
                question.questionId
            );

        if (existing) {
            throw new Error(
                `Question '${question.questionId}' sudah ada.`
            );
        }

        return this.repository.create(
            question
        );
    }

    update(
        questionId: string,
        question: Question
    ): Question {
        return this.repository.update(
            questionId,
            question
        );
    }

    delete(
        questionId: string
    ): boolean {
        return this.repository.delete(
            questionId
        );
    }

    search(
        filter: Parameters<
            QuestionRepository["search"]
        >[0]
    ): Question[] {
        return this.repository.search(
            filter
        );
    }

    statistics() {

        const questions =
            this.getAll();

        const countBy =
            <T extends string>(
                selector:
                    (
                        question: Question
                    ) => T
            ): Record<string, number> => {

                const result:
                    Record<string, number> = {};

                for (
                    const question of questions
                ) {

                    const key =
                        selector(question);

                    result[key] =
                        (
                            result[key] ??
                            0
                        ) + 1;
                }

                return result;
            };

        return {
            total:
                questions.length,

            byPhase:
                countBy(
                    question =>
                        question.phase
                ),

            bySubject:
                countBy(
                    question =>
                        question.subject
                ),

            byCognitiveLevel:
                countBy(
                    question =>
                        question.cognitiveLevel
                ),

            byType:
                countBy(
                    question =>
                        question.questionType
                ),

            byStatus:
                countBy(
                    question =>
                        question.status
                ),

            byDifficulty:
                this.countDifficulty(
                    questions
                ),

            byCLD:
                this.countCLD(
                    questions
                ),

            byKBC:
                this.countKBC(
                    questions
                )
        };
    }

    private countDifficulty(
        questions: Question[]
    ): Record<string, number> {

        const result:
            Record<string, number> = {};

        for (
            const question of questions
        ) {

            const difficulty =
                question.difficulty;

            if (!difficulty) {
                continue;
            }

            result[difficulty] =
                (
                    result[difficulty] ??
                    0
                ) + 1;
        }

        return result;
    }

    private countCLD(
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

                result[mapping.dimension] =
                    (
                        result[mapping.dimension] ??
                        0
                    ) + 1;
            }
        }

        return result;
    }

    private countKBC(
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
                    result[primary] ??
                    0
                ) + 1;
        }

        return result;
    }

    score(
        question: Question,
        studentAnswer: StudentAnswer
    ): ScoreResult {

        return this.scorer.score(
            question,
            studentAnswer
        );
    }
}

export const questionService =
    new QuestionService();
