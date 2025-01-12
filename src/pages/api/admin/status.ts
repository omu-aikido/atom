import {
    createUserStatus,
    getUserStatus,
    updateUserStatus,
    deleteUserStatus,
} from "@/src/lib/user";

// 登録
export async function POST(request: Request) {
    const status = await request.json();
    const email = status.email;
    const year = status.year;
    const grade = status.grade;
    if (email == null || year == null || grade == null) {
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
    const res = await createUserStatus(email, Number(year), Number(grade));
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
    const email = url.searchParams.get("email");
    if (email == null) {
        return new Response(
            JSON.stringify({
                status: 500,
                message: "Unexpected error",
            })
        );
    }
    const status = await getUserStatus(email);
    if (status == null) {
        new Response(
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

// 更新
export async function PUT(request: Request) {
    const user = await request.json();
    if (user == null) {
        return new Response(
            JSON.stringify({
                status: 500,
                message: "Unexpected error",
            })
        );
    }

    const statusData = {
        email: user.email,
        grade: user.grade,
        joinedAt: user.joinedAt,
    };
    const status = await updateUserStatus(
        statusData.email,
        statusData.grade,
        statusData.joinedAt
    );
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
