import { prisma } from "./prisma";
import { type Session } from "better-auth";

export async function getUser(id: string) {
    return await prisma.account.findUnique({
        where: { id },
    });
}

export async function getUserByToken(token: string) {
    const session = await prisma.session.findUnique({
        where: { token },
        include: {
            user: true,
        },
    });
    return session?.user;
}

export async function getUserFromSession(session: Session) {
    return getUserByToken(session.token);
}

export async function getSession(token: string) {
    return await prisma.session.findUnique({
        where: { token },
    });
}

export async function getStatusFromSession(session: Session) {
    const user = await getUserByToken(session.token);
    if (user == null) {
        return null;
    }
    return await prisma.status.findUnique({
        where: { email: user.email },
    });
}

export async function getUsers() {
    return prisma.account.findMany();
}

export async function getUserStatus(email: string) {
    return prisma.status.findUnique({
        where: { email },
        include: {
            user: true,
        },
    });
}

export async function getUserStatuses() {
    return prisma.status.findMany({
        include: {
            user: true,
        },
    });
}

export async function createUserStatus(
    email: string,
    grade: number,
    joinedAt: number
) {
    if (await prisma.status.findUnique({ where: { email } })) {
        throw new Error("User already exists");
    }
    try {
        return prisma.$transaction([
            prisma.status.create({
                data: {
                    email,
                    grade,
                    joinedAt,
                },
            }),
        ]);
    } catch (err) {
        throw new Error("Failed to create user");
    }
}

export async function updateUserStatus(
    email: string,
    grade: number,
    joinedAt: number
) {
    if (!(await prisma.status.findUnique({ where: { email } }))) {
        throw new Error("User does not exist");
    }
    try {
        return prisma.$transaction([
            prisma.status.update({
                where: { email },
                data: {
                    grade,
                    joinedAt,
                },
            }),
        ]);
    } catch (err) {
        throw new Error("Unexpected error");
    }
}

export async function deleteUserStatus(email: string) {
    if (!(await prisma.status.findUnique({ where: { email } }))) {
        throw new Error("User does not exist");
    }
    try {
        return prisma.$transaction([
            prisma.status.delete({
                where: { email },
            }),
        ]);
    } catch (err) {
        throw new Error("Unexpected error");
    }
}