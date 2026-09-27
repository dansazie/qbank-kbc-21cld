const PORTAL_QBANK_BASE =
    "./generated/portal/";

const portalQBank = {
    matematika: null,
    ipas: null,
    kbc: null
};

async function loadPortalWorksheet(subject) {
    if (portalQBank[subject]) {
        return portalQBank[subject];
    }

    const worksheetResponse =
        await fetch(
            `${PORTAL_QBANK_BASE}${subject}.json`,
            {
                cache: "no-store"
            }
        );

    if (!worksheetResponse.ok) {
        throw new Error(
            `Gagal memuat QBank ${subject}: HTTP ${worksheetResponse.status}`
        );
    }

    const worksheet =
        await worksheetResponse.json();

    let answerKey = null;

    if (subject === "kbc") {
        const answerResponse =
            await fetch(
                `${PORTAL_QBANK_BASE}${subject}-answer-key.json`,
                {
                    cache: "no-store"
                }
            );

        if (!answerResponse.ok) {
            throw new Error(
                `Gagal memuat answer key ${subject}: HTTP ${answerResponse.status}`
            );
        }

        answerKey =
            await answerResponse.json();
    }

    portalQBank[subject] = {
        worksheet,
        answerKey
    };

    return portalQBank[subject];
}

function normalizeKbcQuestion(
    question,
    answerKey
) {
    const answerItem =
        answerKey?.answers?.find(
            item =>
                item.questionId ===
                question.questionId
        );

    const answerId =
        answerItem?.answer;

    const answerIndex =
        question.options?.findIndex(
            option =>
                option.id === answerId
        );

    let level = 1;

    if (
        question.cognitiveLevel === "C2"
    ) {
        level = 2;
    } else if (
        question.cognitiveLevel === "C3"
    ) {
        level = 3;
    } else if (
        question.cognitiveLevel === "C4"
    ) {
        level = 4;
    }

    return {
        questionId:
            question.questionId,

        level,

        pilar:
            question.kbc?.primary ??
            "KBC",

        q:
            question.stem,

        options:
            (question.options ?? [])
                .map(option => option.text),

        ans:
            answerIndex >= 0
                ? answerIndex
                : 0,

        explain:
            answerItem?.explanation ??
            "Pelajari kembali materi terkait."
    };
}

async function getPortalQuestions(
    subject
) {
    const data =
        await loadPortalWorksheet(
            subject
        );

    if (
        !data ||
        !data.worksheet ||
        !Array.isArray(
            data.worksheet.questions
        )
    ) {
        throw new Error(
            `Format worksheet QBank ${subject} tidak valid.`
        );
    }

    if (subject === "kbc") {
        return data.worksheet.questions.map(
            question =>
                normalizeKbcQuestion(
                    question,
                    data.answerKey
                )
        );
    }

    return data.worksheet.questions;
}

window.portalQBank = {
    loadWorksheet:
        loadPortalWorksheet,

    getQuestions:
        getPortalQuestions
};
