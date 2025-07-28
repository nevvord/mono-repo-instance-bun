import { User, Session, UserRole } from "../../generated/prisma";

// User types
export type UserWithoutPassword = Omit<User, "password">;
export type CreateUserInput = Omit<
  User,
  "id" | "createdAt" | "updatedAt" | "sessions"
>;
export type UpdateUserInput = Partial<
  Omit<User, "id" | "createdAt" | "updatedAt" | "sessions">
>;

// Session types
export type CreateSessionInput = Omit<
  Session,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateSessionInput = Partial<
  Omit<Session, "id" | "createdAt" | "updatedAt">
>;

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: UserWithoutPassword;
  session: Session;
  token: string;
}

// Re-export Prisma types
export type { User, Session, UserRole };
