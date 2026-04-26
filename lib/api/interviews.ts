import { apiClient } from "./client";
import { getPublicApiBaseUrl } from "@/lib/config/env";

export interface QuestionEvaluation {
  question_text: string;
  question_type: string;
  score: number;
  response_quality: string;
  key_points: string[];
  concerns: string[];
}

export interface AISummary {
  overall_assessment?: string;
  job_fit?: string;
  key_strengths?: string[];
  areas_of_concern?: string[];
  technical_skills?: string[];
  motivation_for_role?: string;
  recommendations?: string;
}

export interface CandidateReport {
  id: string;
  score: string | null;
  technical_score: string | null;
  behavioral_score: string | null;
  communication_score: string | null;
  cultural_fit_score: string | null;
  question_coverage: string | null;
  questions_answered: number | null;
  total_questions: number | null;
  screening_score?: string | null;
  screening_passed?: boolean | null;
  screening_evaluation?: string | null;
  total_experience_years?: string | null;
  notice_period_days?: number | null;
  expected_salary_min?: string | null;
  expected_salary_max?: string | null;
  transcript?: string | null;
  technical_summary?: string | null;
  behavioral_summary?: string | null;
  communication_summary?: string | null;
  cultural_fit_summary?: string | null;
  total_score?: string | null;
  question_evaluations?: QuestionEvaluation[] | null;
  ai_summary?: AISummary | null;
  duration_seconds?: number | null;
  created_at?: string;
  updated_at?: string;
  availability_date?: string | null;
  current_ctc?: string | null;
  current_location?: string | null;
  interview_duration_minutes?: number | null;
  interview_round?: string | null;
  red_flags?: string | null;
  unanswered_questions?: string | null;
  willing_to_relocate?: boolean | null;
  screening_answers?: {
    [questionId: string]: { question_text: string; answer: string };
  } | null;
}

/** Nested interview summary on candidate GET (scheduling / share link). */
export interface CandidatePortalInterview {
  id: string;
  questionnaire_title: string;
  status: string;
  deadline?: string | null;
  type?: string;
}

export interface InterviewCandidate {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  resume_file_path?: string | null;
  has_resume_file?: boolean;
  schedule_date?: string | null;
  status?: string;
  score?: number | null;
  notes?: string;
  invited_at?: string;
  completed_at?: string | null;
  reports?: CandidateReport[];
  created_at?: string;
  updated_at?: string;
  interview?: CandidatePortalInterview;
}

function candidatePortalErrorMessage(body: unknown): string {
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    if (typeof o.message === "string") return o.message;
    const d = o.detail;
    if (typeof d === "string") return d;
    if (d && typeof d === "object" && "message" in d && typeof (d as { message: string }).message === "string") {
      return (d as { message: string }).message;
    }
  }
  return "Request failed";
}

/**
 * Candidate scheduling page: no employer Bearer token — only `X-Access-Token` (matches Angular `getCandidate`).
 */
export async function getCandidatePortal(
  candidateId: string,
  accessToken: string
): Promise<InterviewCandidate> {
  const base = getPublicApiBaseUrl();
  const res = await fetch(
    `${base}/api/interviews/candidates/${encodeURIComponent(candidateId)}/`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Access-Token": accessToken,
      },
    }
  );
  let body: unknown = {};
  try {
    body = await res.json();
  } catch {
    body = {};
  }
  if (!res.ok) {
    throw new Error(candidatePortalErrorMessage(body));
  }
  return body as InterviewCandidate;
}

/**
 * Candidate scheduling submit: multipart PUT with token (matches Angular `updateCandidateWithFile`).
 */
export async function updateCandidatePortal(
  candidateId: string,
  interviewId: string,
  accessToken: string,
  fields: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    scheduleDateIso: string;
  }
): Promise<unknown> {
  const formData = new FormData();
  formData.append("interview_id", interviewId);
  formData.append("first_name", fields.firstName);
  formData.append("last_name", fields.lastName);
  formData.append("email", fields.email);
  formData.append("phone", fields.phone);
  formData.append("schedule_date", fields.scheduleDateIso);
  formData.append("id", candidateId);

  const base = getPublicApiBaseUrl();
  const res = await fetch(
    `${base}/api/interviews/candidates/${encodeURIComponent(candidateId)}/`,
    {
      method: "PUT",
      headers: {
        "X-Access-Token": accessToken,
      },
      body: formData,
    }
  );
  let body: unknown = {};
  try {
    body = await res.json();
  } catch {
    body = {};
  }
  if (!res.ok) {
    throw new Error(candidatePortalErrorMessage(body));
  }
  return body;
}

export interface AddCandidateRequest {
  id?: string;
  interview_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  schedule_date: string;
  notes?: string;
}

export interface CreateInterviewRequest {
  questionnaire_id: string;
  scheduled_date: string;
  candidates: Partial<AddCandidateRequest>[];
  type?: string;
  deadline?: string;
}

export interface Interview {
  id: string;
  questionnaire: string;
  questionnaire_title: string;
  scheduled_date: string;
  status: string;
  created_by: string;
  candidates: InterviewCandidate[];
  created_at: string;
  updated_at: string;
  deadline?: string | null;
  /** Onsite invite email—populated on interview detail GET (Django `InterviewDetailView.retrieve`). */
  onsite_interview_email_template?: string;
  onsite_interview_email_subject?: string;
}

export interface InterviewListItem {
  id: string;
  questionnaire_title: string;
  created_by: string;
  status: "pending" | "completed" | "scheduled" | "processing" | "failed" | string;
  scheduled_date: string;
  candidate_number: number;
  created_at: string;
}

export interface PaginatedInterviewResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: InterviewListItem[];
}

/** Signed URL payload from GET `/api/interviews/candidates/:id/resume/download/` (Django + FastAPI). */
export interface CandidateResumeDownloadResponse {
  download_url: string;
  candidate_name?: string;
  expires_in_minutes?: number;
}

export const interviewsApi = {
  createInterview: async (payload: CreateInterviewRequest) => {
    const { data } = await apiClient.post<Interview>(`/api/interviews/`, payload);
    return data;
  },

  getInterviews: async (page = 1, pageSize = 10) => {
    const { data } = await apiClient.get<PaginatedInterviewResponse>(
      `/api/interviews/?page=${page}&page_size=${pageSize}`
    );
    return data;
  },

  getInterviewById: async (id: string) => {
    const { data } = await apiClient.get<Interview>(
      `/api/interviews/${id}/`
    );
    return data;
  },

  deleteInterview: async (id: string) => {
    const { data } = await apiClient.delete(`/api/interviews/${id}/`);
    return data;
  },

  addCandidateToInterview: async (payload: AddCandidateRequest) => {
    const { data } = await apiClient.post<InterviewCandidate>(`/api/interviews/candidates/`, payload);
    return data;
  },

  getCandidateReport: async (candidateId: string) => {
    const { data } = await apiClient.get<CandidateReport>(
      `/api/interviews/candidates/${candidateId}/report/`
    );
    return data;
  },

  downloadCandidateResume: async (candidateId: string) => {
    const { data } = await apiClient.get<CandidateResumeDownloadResponse>(
      `/api/interviews/candidates/${candidateId}/resume/download/`
    );
    return data;
  },

  getAssistantData: async (id: string) => {
    const { data } = await apiClient.get<any>(
      `/api/interviews/assistant-data/${id}/`
    );
    return data;
  },

  getScreeningQuestions: async (id: string) => {
    const { data } = await apiClient.get<any>(
      `/api/interviews/${id}/screening-questions/`
    );
    return data;
  },

  evaluateScreeningAnswersWithFile: async (formData: FormData) => {
    const { data } = await apiClient.post<any>(
      `/api/interviews/screening-evaluate/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  getCandidate: async (candidateId: string, token: string) => {
    const { data } = await apiClient.get<InterviewCandidate>(
      `/api/interviews/candidates/${candidateId}/`,
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    return data;
  },

  updateCandidateWithFile: async (formData: FormData, token: string) => {
    const candidateId = formData.get("id");
    const { data } = await apiClient.put<any>(
      `/api/interviews/candidates/${candidateId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": token,
        },
      }
    );
    return data;
  },

  sendInvitesToCandidates: async (
    interviewId: string,
    candidateIds: string[],
    inviteLink: string,
    emailTemplate?: string,
    emailSubject?: string
  ) => {
    const payload: Record<string, unknown> = {
      candidate_ids: candidateIds,
      invite_link: inviteLink,
    };
    if (emailTemplate) payload.email_template = emailTemplate;
    if (emailSubject) payload.email_subject = emailSubject;

    const { data } = await apiClient.post<unknown>(
      `/api/interviews/${interviewId}/send-invites/`,
      payload
    );
    return data;
  }
};
