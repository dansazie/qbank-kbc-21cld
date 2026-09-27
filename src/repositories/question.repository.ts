import path from "node:path";
import {
    existsSync,
    unlinkSync
} from "node:fs";

import type {
    CognitiveLevel,
    Question,
    QuestionStatus,
    QuestionType
} from "../types/question.js";

import {
    JsonRepository
} from "./json.repository.js";

import {
    listJsonFiles
} from "../utils/file.js";

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

    constructor(
        root = "data/questions"
    ) {
        super(
            path.resolve(root)
        );
    }

    getAll(): Question[] {
        return this.findAll();
    }

    getById(
        questionId: string
    ): Question | undefined {
        return this.findById(
            questionId
        );
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
            .filter(
                question => {

                    if (
                        filter.phase &&
                        question.phase !==
                        filter.phase
                    ) {
                        return false;
                    }

                    if (
                        filter.grade !==
                        undefined &&
                        question.grade !==
                        filter.grade
                    ) {
                        return false;
                    }

                    if (
                        filter.subject &&
                        question.subject !==
                        filter.subject
                    ) {
                        return false;
                    }

                    if (
                        filter.element &&
                        question.element !==
                        filter.element
                    ) {
                        return false;
                    }

                    if (
                        filter.status &&
                        question.status !==
                        filter.status
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
                        question.cpId !==
                        filter.cpId
                    ) {
                        return false;
                    }

                    if (
                        filter.tpId &&
                        question.tpId !==
                        filter.tpId
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
                }
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

        const filePath =
            this.defaultFilePath(
                question.questionId
            );

        this.writeFile(
            filePath,
            question
        );

        return question;
    }

    update(
        questionId: string,
        question: Question
    ): Question {

        const filePath =
            this.findFilePath(
                questionId
            );

        if (!filePath) {
            throw new Error(
                `Question '${questionId}' tidak ditemukan.`
            );
        }

        this.writeFile(
            filePath,
            {
                ...question,
                questionId
            }
        );

        return {
            ...question,
            questionId
        };
    }

    delete(
        questionId: string
    ): boolean {

        const filePath =
            this.findFilePath(
                questionId
            );

        if (!filePath) {
            return false;
        }

        unlinkSync(
            filePath
        );

        return true;
    }

    private defaultFilePath(
        questionId: string
    ): string {
        return path.join(
            this.directory,
            `${questionId}.json`
        );
    }

    private findFilePath(
        questionId: string
    ): string | undefined {

        const files =
            listJsonFiles(
                this.directory
            );

        for (
            const file of files
        ) {

            const question =
                this.readFile(
                    file
                );

            if (
                question.questionId ===
                questionId
            ) {
                return file;
            }
        }

        return undefined;
    }
}
