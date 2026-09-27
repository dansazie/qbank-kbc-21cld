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

    const response =
        await fetch(
            `${PORTAL_QBANK_BASE}${subject}.json`,
            {
                cache: "no-store"
            }
        );

    if (!response.ok) {
        throw new Error(
            `Gagal memuat QBank ${subject}: HTTP ${response.status}`
        );
    }

    const payload =
        await response.json();

    portalQBank[subject] =
        payload;

    return payload;
}

async function getPortalQuestions(subject) {
    const worksheet =
        await loadPortalWorksheet(
            subject
        );

    if (
        !worksheet ||
        !Array.isArray(
            worksheet.questions
        )
    ) {
        throw new Error(
            `Format worksheet QBank ${subject} tidak valid.`
        );
    }

    return worksheet.questions;
}

window.portalQBank = {
    loadWorksheet:
        loadPortalWorksheet,

    getQuestions:
        getPortalQuestions
};
