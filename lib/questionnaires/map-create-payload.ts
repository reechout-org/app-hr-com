/**
 * Maps the CreateQuestionnaireModal nested state to FastAPI `QuestionnaireCreate` / legacy API body.
 * Label conventions match the legacy Angular `getFormValue()` mapping.
 */

import type { QuestionnaireCreateBody } from "@/lib/api/questionnaires";

const WORK_LEVEL_LABELS = ["Very Low", "Low", "Medium", "High", "Very High"] as const;

const COMPETENCY_IMPORTANCE_LABELS = [
  "Not Relevant",
  "Nice to Have",
  "Important",
  "Critical",
] as const;

function workDemandToLabel(value: number): string {
  const idx = Math.max(0, Math.min(4, value - 1));
  return WORK_LEVEL_LABELS[idx] ?? "Medium";
}

function competencyToLabel(value: number): string {
  const idx = Math.max(0, Math.min(3, value));
  return COMPETENCY_IMPORTANCE_LABELS[idx] ?? "Nice to Have";
}

function parseOptionalDecimal(raw: string): number | null {
  if (raw === "" || raw === undefined || raw === null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export type CreateQuestionnaireModalState = {
  roleInfo: {
    roleName: string;
    companyName: string;
    department: string;
    seniorityLevel: string;
    location: string;
    yearsOfExperience: string;
    minSalary: string;
    maxSalary: string;
    numberOfQuestions: number;
    jobDescription: string;
  };
  workDemands: {
    stressLevel: number;
    customerContact: number;
    teamworkVsSolo: number;
    ambiguityChange: number;
  };
  competencies: {
    reliabilityOwnership: number;
    learningAdaptability: number;
    communicationClarity: number;
    empathyCollaboration: number;
    resilienceStress: number;
    valuesCultureFit: number;
  };
  culture: {
    paceOfWork: number;
    feedbackStyle: number;
    decisionMaking: number;
    collaboration: number;
  };
  performance: {
    topPerformers: string;
    commonFailureModes: string;
  };
};

const COMPETENCY_ROWS: {
  id: string;
  name: string;
  key: keyof CreateQuestionnaireModalState["competencies"];
}[] = [
  { id: "reliability", name: "Reliability & Ownership", key: "reliabilityOwnership" },
  { id: "learning", name: "Learning & Adaptability", key: "learningAdaptability" },
  { id: "communication", name: "Communication & Clarity", key: "communicationClarity" },
  { id: "empathy", name: "Empathy & Collaboration", key: "empathyCollaboration" },
  { id: "resilience", name: "Resilience Under Stress", key: "resilienceStress" },
  { id: "values", name: "Values & Culture Fit", key: "valuesCultureFit" },
];

const CULTURE_ROWS: {
  id: string;
  label: string;
  key: keyof CreateQuestionnaireModalState["culture"];
}[] = [
  { id: "pace", label: "Pace of Work", key: "paceOfWork" },
  { id: "feedback", label: "Feedback Style", key: "feedbackStyle" },
  { id: "decision", label: "Decision Making", key: "decisionMaking" },
  { id: "collaboration", label: "Collaboration", key: "collaboration" },
];

export function mapCreateFormToApiBody(
  form: CreateQuestionnaireModalState
): QuestionnaireCreateBody {
  const { roleInfo, workDemands, competencies, culture, performance } = form;

  const nQ = roleInfo.numberOfQuestions;
  const number_of_questions = Math.max(1, Math.min(15, Number.isFinite(nQ) ? nQ : 5));

  return {
    details: roleInfo.jobDescription || "",
    number_of_questions,
    job_role_title: roleInfo.roleName || "",
    department: roleInfo.department || "",
    seniority_level: roleInfo.seniorityLevel || "",
    location: roleInfo.location || "",
    work_environment: {
      stress_level: workDemandToLabel(workDemands.stressLevel),
      customer_contact: workDemandToLabel(workDemands.customerContact),
      teamwork_vs_solo: workDemandToLabel(workDemands.teamworkVsSolo),
      ambiguity_change: workDemandToLabel(workDemands.ambiguityChange),
    },
    competency_ratings: COMPETENCY_ROWS.map((row) => ({
      id: row.id,
      name: row.name,
      importance_label: competencyToLabel(competencies[row.key]),
    })),
    team_culture_profile: CULTURE_ROWS.map((row) => ({
      id: row.id,
      label: row.label,
      value_label: competencyToLabel(culture[row.key]),
    })),
    success_patterns: performance.topPerformers || "",
    failure_patterns: performance.commonFailureModes || "",
    company_name: roleInfo.companyName || null,
    min_salary: parseOptionalDecimal(roleInfo.minSalary),
    max_salary: parseOptionalDecimal(roleInfo.maxSalary),
    years_of_experience: parseOptionalDecimal(roleInfo.yearsOfExperience),
    title: roleInfo.roleName ? roleInfo.roleName.slice(0, 200) : undefined,
  };
}
