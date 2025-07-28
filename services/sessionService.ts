import { prisma } from "../lib/prisma";
import { CreateSessionInput, UpdateSessionInput } from "../types/auth";
import crypto from "crypto";

export class SessionService {
  // Create a new session
  static async createSession(sessionData: CreateSessionInput) {
    return await prisma.session.create({
      data: sessionData,
    });
  }

  // Get session by token
  static async getSessionByToken(token: string) {
    return await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isActive: true,
            isVerified: true,
            role: true,
          },
        },
      },
    });
  }

  // Get active sessions for a user
  static async getUserSessions(userId: string) {
    return await prisma.session.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Update session
  static async updateSession(id: string, sessionData: UpdateSessionInput) {
    return await prisma.session.update({
      where: { id },
      data: sessionData,
    });
  }

  // Deactivate session
  static async deactivateSession(id: string) {
    return await prisma.session.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Deactivate all sessions for a user
  static async deactivateAllUserSessions(userId: string) {
    return await prisma.session.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });
  }

  // Delete expired sessions
  static async deleteExpiredSessions() {
    return await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  // Generate session token
  static generateSessionToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  // Calculate session expiration (default: 30 days)
  static calculateExpiration(days: number = 30): Date {
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + days);
    return expiration;
  }

  // Check if session is valid
  static isSessionValid(session: any): boolean {
    return session.isActive && session.expiresAt > new Date();
  }
}
