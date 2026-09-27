import type { Question } from "../types/question.js";

export interface StudentAnswer {
    questionId: string;
    answer: string | string[];
}

export interface ScoreResult {
    questionId: string;
    score: number;
    maxScore: number;
    correct: boolean;
}

export class ScoringEngine {

    score(
        question: Question,
        studentAnswer: StudentAnswer
    ): ScoreResult {

        const expected = question.answer;

        if (
            expected === undefined ||
            expected === null
        ) {
            return {
                questionId: question.questionId,
                score: 0,
                maxScore: 0,
                correct: false
            };
        }

        const correct =
            this.compare(expected, studentAnswer.answer);

        return {
            questionId: question.questionId,
            score: correct ? 1 : 0,
            maxScore: 1,
            correct
        };
    }

    private compare(
        expected: string | string[],
        actual: string | string[]
    ): boolean {

        if (
            Array.isArray(expected) &&
            Array.isArray(actual)
        ) {
            const a = [...expected].sort();
            const b = [...actual].sort();

            return JSON.stringify(a) === JSON.stringify(b);
        }

        return expected === actual;
    }
}
