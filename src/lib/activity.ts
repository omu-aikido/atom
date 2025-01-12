import { prisma } from "./prisma";

export async function getAllActivities() {
    return prisma.activity.findMany();
}

export async function getActivity(id: string) {
    return prisma.activity.findUnique({
        where: { id },
    });
}

export async function getUserActivities(email: string) {
    return prisma.activity.findMany({
        where: {
            email,
        },
    });
}

export async function getUserActivitiesInDateRange(
    email: string,
    start: Date,
    end: Date
) {
    return prisma.activity.findMany({
        where: {
            email,
            date: {
                gte: start,
                lte: end,
            },
        },
    });
}

export async function createActivity(
    email: string,
    date: Date,
    period: number
) {
    const activity = {
        email,
        date,
        period,
        createAt: new Date(),
    };

    return prisma.$transaction([
        prisma.activity.create({
            data: activity,
        }),
    ]);
}

export async function updateActivity(
    id: string,
    date: Date | undefined,
    period: number | undefined
) {
    return prisma.$transaction([
        prisma.activity.update({
            where: { id },
            data: {
                date,
                period,
            },
        }),
    ]);
}
