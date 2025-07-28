import { prisma } from "../lib/prisma";
import {
  CreateUserInput,
  UpdateUserInput,
  UserWithoutPassword,
} from "../types/auth";
import bcrypt from "bcryptjs";

export class UserService {
  // Create a new user
  static async createUser(
    userData: CreateUserInput
  ): Promise<UserWithoutPassword> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
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
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  // Get user by ID
  static async getUserById(id: string): Promise<UserWithoutPassword | null> {
    return await prisma.user.findUnique({
      where: { id },
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
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Get user by email
  static async getUserByEmail(
    email: string
  ): Promise<UserWithoutPassword | null> {
    return await prisma.user.findUnique({
      where: { email },
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
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Get user by username
  static async getUserByUsername(
    username: string
  ): Promise<UserWithoutPassword | null> {
    return await prisma.user.findUnique({
      where: { username },
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
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Update user
  static async updateUser(
    id: string,
    userData: UpdateUserInput
  ): Promise<UserWithoutPassword | null> {
    const updateData: any = { ...userData };

    // Hash password if it's being updated
    if (userData.password) {
      updateData.password = await bcrypt.hash(userData.password, 12);
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
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
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Delete user
  static async deleteUser(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Verify password
  static async verifyPassword(
    userId: string,
    password: string
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) return false;

    return await bcrypt.compare(password, user.password);
  }
}
