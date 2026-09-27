import {
    QuestionService
} from "../services/question.service.js";

import {
    FrameworkRepository
} from "../data/framework.repository.js";

import {
    referenceData
} from "../data/reference.data.js";

export const questionService =
    new QuestionService();

export const frameworkRepository =
    new FrameworkRepository();

export {
    referenceData
};

export function findQuestion(
    questionId: string
) {

    return questionService
        .getAll()
        .find(
            question =>
                question.questionId ===
                questionId
        );
}

export function findReference(
    referenceId: string
) {

    return referenceData.find(
        reference =>
            reference.referenceId ===
            referenceId
    );
}
