import {
    createUserStatus,
    getUserStatus,
    updateUserStatus,
    deleteUserStatus,
} from "@/src/lib/user";

import { prisma } from "@/src/lib/prisma";

// 登録
export async function POST(request: Request) {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const year = url.searchParams.get("year");
    const grade = url.searchParams.get("grade");
    if (email == null) {
        return new Response(
            JSON.stringify({
                status: 500,
                message: "Unexpected error",
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
    const res = await createUserStatus(email, Number(grade), Number(year));
    if (res.length > 0) {
        return new Response(
            JSON.stringify({
                status: 500,
                message: "Unexpected error",
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    return new Response(JSON.stringify(res[0]), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}

// 取得
export async function GET(request: Request) {
    // パラメータ取得
    const url = new URL(request.url);
    const sessiontoken = url.searchParams.get("token");
    if (sessiontoken == null) {
        return new Response(
            JSON.stringify({
                status: 500,
                "Content-Type": "application/json",
                message: "Unexpected error",
            })
        );
    }
    const session = await prisma.session.findUnique({
        where: {
            token: sessiontoken,
        },
        include: {
            user: true,
        },
    });
    if (session?.id !== null) {
        const status = await getUserStatus(session!.user.email);
        return new Response(JSON.stringify(status), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control":
                    "max-age=0, s-maxage=14400, stale-while-revalidate=0",
            },
        });
    } else {
        new Response(
            JSON.stringify({
                status: 500,
                "Content-Type": "application/json",
                message: "Unexpected error",
            })
        );
    }
}

// 削除
export async function DELETE(request: Request) {
    const user = await request.json();
    if (user == null) {
        return new Response(
            JSON.stringify({
                status: 500,
                message: "Unexpected error",
            })
        );
    }
    const email = user.email;
    if (email == null) {
        return new Response(
            JSON.stringify({
                status: 500,
                message: "Unexpected error",
            })
        );
    }
    const status = await deleteUserStatus(email);
    if (status == null) {
        return new Response(
            JSON.stringify({
                status: 500,
                message: "Unexpected error",
            })
        );
    }
    return new Response(JSON.stringify(status), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}
