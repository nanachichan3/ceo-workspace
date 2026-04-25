// ─── Shared Types ─────────────────────────────────────────────────────────────

export type UserRole = "PARENT" | "ADMIN";

export type FamilyMemberRole = "PARENT" | "CHILD";

export type ProgressType =
  | "READING"
  | "PROJECT"
  | "CONVERSATION"
  | "EXPLORATION"
  | "PRACTICE"
  | "OTHER";

export type ProjectStatus = "IDEATION" | "IN_PROGRESS" | "COMPLETED" | "ABANDONED";

export type WaitlistStatus = "PENDING" | "INVITED" | "CONVERTED" | "EXPIRED";

// ─── API Response Shapes ───────────────────────────────────────────────────────

export interface ApiError {
  error: string;
}

export interface ApiSuccess<T> {
  [key: string]: T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

export interface MeResponse {
  user: AuthUser;
  family: {
    id: string;
    name: string;
    children: ChildSummary[];
  } | null;
  children: ChildSummary[];
}

export interface LoginRequest {
  email: string;
}

export interface SignupRequest {
  email: string;
  name?: string;
  password?: string;
}

// ─── Children ─────────────────────────────────────────────────────────────────

export interface ChildSummary {
  id: string;
  name: string;
  age: number;
  avatarUrl?: string;
  learningProfile?: Record<string, unknown>;
  _count?: {
    progressEntries: number;
    projects: number;
  };
}

export interface ChildDetail extends ChildSummary {
  familyId: string;
  progressEntries?: ProgressEntry[];
  projects?: Project[];
  aiSessions?: AISession[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateChildRequest {
  name: string;
  age: number;
  learningProfile?: Record<string, unknown>;
  avatarUrl?: string;
}

export interface UpdateChildRequest {
  name?: string;
  age?: number;
  learningProfile?: Record<string, unknown>;
  avatarUrl?: string;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface ProgressEntry {
  id: string;
  childId: string;
  date: string;
  type: ProgressType;
  subject?: string;
  description: string;
  artifactsUrl: string[];
  xpEarned: number;
  createdAt: string;
}

export interface CreateProgressEntryRequest {
  type: ProgressType;
  subject?: string;
  description: string;
  artifactsUrl?: string[];
  xpEarned?: number;
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  childId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  artifactsUrl: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

// ─── AI Sessions ─────────────────────────────────────────────────────────────

export interface AISession {
  id: string;
  childId: string;
  date: string;
  duration: number;
  tokensUsed: number;
  topic?: string;
  summary?: string;
  createdAt: string;
}

export interface CreateAISessionRequest {
  childId: string;
  duration?: number;
  tokensUsed?: number;
  topic?: string;
  summary?: string;
}

export interface ChatRequest {
  childId: string;
  message: string;
  history?: Array<{ role: "user" | "model"; content: string }>;
}

export interface ChatResponse {
  response: string;
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────

export interface WaitlistEntry {
  id: string;
  email: string;
  source?: string;
  status: WaitlistStatus;
  joinedAt: string;
}

export interface JoinWaitlistRequest {
  email: string;
  source?: string;
}
