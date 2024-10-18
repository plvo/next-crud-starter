"use server";

import { apiInternalError } from "@/lib/constants";
import { ApiResponse } from "@/types/api";
import { UserWithPublication } from "@/types/prisma";
import { PrismaClient, user } from "@prisma/client";

const prisma = new PrismaClient();

const userGet = async <T extends boolean, U extends boolean>(
  id: string,
  withPublications?: T,
  withAll?: U
): Promise<ApiResponse<user>> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        profile_img: true,
        password: withAll,
        created_at: withAll,
        updated_at: withAll,
        publications: withPublications,
      }
    });

    if (!user) {
      return {
        ok: false,
        message: "user not found",
      };
    }

    return { ok: true, data: user };
  } catch (error) {
    console.error(error);
    return apiInternalError;
  } finally {
    await prisma.$disconnect();
  }
};

const userGetAll = async <T extends boolean>(
  withPublications?: T
): Promise<ApiResponse<T extends true ? UserWithPublication[] : user[]>> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        publications: withPublications as boolean,
      },
    });
    return {
      ok: true,
      data: users as T extends true ? UserWithPublication[] : user[],
    };
  } catch (error) {
    console.error(error);
    return apiInternalError;
  } finally {
    await prisma.$disconnect();
  }
};

export { userGet, userGetAll };