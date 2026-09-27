import path from "node:path";

import type {
    CognitiveLevel,
    Question,
    QuestionStatus,
    QuestionType
} from "../types/question.js";

import { JsonRepository } from "./json.repository.js";

export interface QuestionFilter {
    phase?: string;
    grade?: number;
    subject?: string;
    element?: string;
    status?: QuestionStatus;
    cognitiveLevel?: CognitiveLevel;
    questionType?: QuestionType;
    curriculumId?: string;
    cpId?: string;
    tpId?: string;
    cldDimension?: string;
    kbcPrimary?: string;
    difficulty?: "easy" | "medium" | "hard";
    tag?: string;
}

export class QuestionRepository
    extends JsonRepository<Question> {

    constructor(root = "data/questions") {
        super(path.resolve(root));
    }

    findById(
        id: string
    ): Question | undefined {
        return this.findAll()
            .find(
                question =>
                    question.questionId === id
            );
    }

    findByPhase(
        phase: string
    ): Question[] {
        return this.findAll()
            .filter(
                question =>
                    question.phase === phase
            );
    }

    findBySubject(
        subject: string
    ): Question[] {
        return this.findAll()
            .filter(
                question =>
                    question.subject === subject
            );
    }

    search(
        filter: QuestionFilter
    ): Question[] {

        return this.findAll()
            .filter(question => {

                if (
                    filter.phase &&
                    question.phase !== filter.phase
                ) {
                    return false;
                }

                if (
                    filter.grade &&
                    question.grade !== filter.grade
                ) {
                    return false;
                }

                if (
                    filter.subject &&
                    question.subject !== filter.subject
                ) {
                    return false;
                }

                if (
                    filter.element &&
                    question.element !== filter.element
                ) {
                    return false;
                }

                if (
                    filter.status &&
                    question.status !== filter.status
                ) {
                    return false;
                }

                if (
                    filter.cognitiveLevel &&
                    question.cognitiveLevel !==
                    filter.cognitiveLevel
                ) {
                    return false;
                }

                if (
                    filter.questionType &&
                    question.questionType !==
                    filter.questionType
                ) {
                    return false;
                }

                if (
                    filter.curriculumId &&
                    question.curriculumId !==
                    filter.curriculumId
                ) {
                    return false;
                }

                if (
                    filter.cpId &&
                    question.cpId !== filter.cpId
                ) {
                    return false;
                }

                if (
                    filter.tpId &&
                    question.tpId !== filter.tpId
                ) {
                    return false;
                }

                if (
                    filter.cldDimension &&
                    !question.cld?.some(
                        item =>
                            item.dimension ===
                            filter.cldDimension
                    )
                ) {
                    return false;
                }

                if (
                    filter.kbcPrimary &&
                    question.kbc?.primary !==
                    filter.kbcPrimary
                ) {
                    return false;
                }

                if (
                    filter.difficulty &&
                    question.difficulty !==
                    filter.difficulty
                ) {
                    return false;
                }

                if (
                    filter.tag &&
                    !question.tags?.includes(
                        filter.tag
                    )
                ) {
                    return false;
                }

                return true;
            });
    }
}
