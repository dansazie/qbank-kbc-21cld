export type PhaseId =
    | "PAUD"
    | "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | "F";

export interface CurriculumReference {
    curriculumId: string;
    phase: PhaseId;
    subject: string;
    element: string;
    cpId?: string;
    cpText?: string;
    tpId?: string;
    tpText?: string;
    materialScope?: string;
}
