import { apiClient } from "./client";

export interface Persona {
  id: string;
  reliability_ownership?: string;
  learning_adaptability?: string;
  communication_clarity?: string;
  empathy_collaboration?: string;
  resilience_stress?: string;
  values_culture_fit?: string;
  job_fit_criteria?: string;
  persona_summary?: string;
  risk_factors?: string;
  success_patterns?: string;
  technical_functional_requirements?: string;
}

export interface Question {
  id?: number;
  questionnaire: number;
  question_text: string;
  order: number;
  created_at?: string;
  question_type?: string;
}

export interface Questionnaire {
  id: string;
  title: string;
  details?: string;
  number_of_questions: number;
  created_at: string;
  user?: string;
  status: "pending" | "processing" | "completed" | "failed";
  company_values?: string;
  candidate_attributes?: string[];
  instructions?: string;
  first_message?: string;
  persona?: Persona;
}

export interface QuestionnaireResponse {
  questionnaire_id: number;
  questionnaire_title: string;
  questions: Question[];
  screening_questions?: Question[];
  regular_questions?: Question[];
  total_questions: number;
  total_screening_questions?: number;
  total_regular_questions?: number;
  first_message?: string;
  company_values?: string;
  candidate_attributes?: string;
  persona?: Persona;
}

export interface PaginatedQuestionnaireResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Questionnaire[];
}

/** Body for `POST /api/questionnaires/` — matches FastAPI `QuestionnaireCreate`. */
export interface QuestionnaireCreateBody {
  title?: string;
  details: string;
  job_role_title: string;
  department: string;
  seniority_level: string;
  location: string;
  work_environment: Record<string, unknown>;
  competency_ratings: Array<{ id: string; name: string; importance_label: string }>;
  team_culture_profile: Array<{ id: string; label: string; value_label: string }>;
  success_patterns: string;
  failure_patterns: string;
  company_name?: string | null;
  min_salary?: number | null;
  max_salary?: number | null;
  years_of_experience?: number | null;
  number_of_questions: number;
}

export type QuestionnaireUpdatePayload = Partial<
  Pick<
    Questionnaire,
    "title" | "details" | "instructions" | "first_message" | "number_of_questions"
  >
>;

export const questionnairesApi = {
  getQuestionnaires: async (page = 1, pageSize = 10) => {
    const { data } = await apiClient.get<PaginatedQuestionnaireResponse>(
      `/api/questionnaires/?page=${page}&page_size=${pageSize}`
    );
    return data;
  },

  createQuestionnaire: async (body: QuestionnaireCreateBody) => {
    const { data } = await apiClient.post<Record<string, unknown>>(
      `/api/questionnaires/`,
      body
    );
    return data;
  },

  getQuestionnaireById: async (id: string) => {
    const { data } = await apiClient.get<QuestionnaireResponse>(
      `/api/questionnaires/${id}/questions/`
    );
    return data;
  },

  updateQuestionnaire: async (id: string, payload: QuestionnaireUpdatePayload) => {
    const { data } = await apiClient.put<Questionnaire>(
      `/api/questionnaires/${id}/`,
      payload
    );
    return data;
  },

  deleteQuestionnaire: async (id: string) => {
    const { data } = await apiClient.delete(`/api/questionnaires/${id}/`);
    return data;
  },
};
