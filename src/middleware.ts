import { auth } from "./lib/auth";
import { defineMiddleware } from "astro:middleware";
import { $Enums, type status, type User } from "@prisma/client";
import { getUserStatus } from "./lib/user";

export const onRequest = defineMiddleware(async (context, next) => {
    context.locals.user = null;
    context.locals.session = null;

    const isAuthed = await auth.api.getSession({
        headers: context.request.headers,
    });

    const api_open =
        context.url.pathname.startsWith("/api/utils") ||
        context.url.pathname.startsWith("/api/auth");

    const api_protected = context.url.pathname.startsWith("/api") && !api_open;

    const level_0 =
        context.url.pathname.startsWith("/signin") ||
        context.url.pathname.startsWith("/signup") ||
        context.url.pathname.startsWith("/forgot");

    const level_1 =
        context.url.pathname.startsWith("/dashboard") ||
        context.url.pathname.startsWith("/app") ||
        context.url.pathname.startsWith("/account") ||
        context.url.pathname.startsWith("/signout");

    const level_2 = context.url.pathname.startsWith("/admin/record") || level_1;

    const level_3 = context.url.pathname.startsWith("/admin/user") || level_2;

    const level_4 =
        context.url.pathname.startsWith("/admin/payment") || level_3;

    const level_5 = context.url.pathname.startsWith("/admin") || level_4;

    if (api_protected) {
        return new Response("Unauthorized", { status: 401 });
    }
    if (isAuthed) {
        const access_level = await accessLevel(isAuthed.user.email);
        if (access_level < 1 && level_1) {
            return new Response("Unauthorized", { status: 401 });
        } else if (access_level < 2 && level_2) {
            return new Response("Unauthorized", { status: 401 });
        } else if (access_level < 3 && level_3) {
            return new Response("Unauthorized", { status: 401 });
        } else if (access_level < 4 && level_4) {
            return new Response("Unauthorized", { status: 401 });
        } else if (access_level < 5 && level_5) {
            return new Response("Unauthorized", { status: 401 });
        }
        return next();
    } else {
        if (!level_0) {
            return Response.redirect(
                new URL(`/signin?from=${context.url.pathname}`, context.url)
            );
        }
    }
    return next();
});

async function accessLevel(email: string): Promise<number> {
    const status = await getUserStatus(email);
    if (
        status?.role === $Enums.Role.Admin ||
        status?.role === $Enums.Role.Captain ||
        status?.role === $Enums.Role.Vice_Cap
    ) {
        return 5; // 活動記録の登録, 会計との精算行為, 他の部員の活動記録の閲覧, 精算の承認,自らのロールの委譲, 他のロールを変更
    } else if (status?.role === $Enums.Role.Treasurer) {
        return 4; // 活動記録の登録, 会計との精算行為, 他の部員の活動記録の閲覧, 精算の承認, 自らのロールの委譲
    } else if (
        status?.role === $Enums.Role.Liaison ||
        status?.role === $Enums.Role.Clerk
    ) {
        return 3; // 活動記録の登録, 会計との精算行為, 他の部員の活動記録の閲覧, 自らのロールの委譲
    } else if (
        status?.year === $Enums.Year.Junior ||
        status?.year === $Enums.Year.Senior
    ) {
        return 2; // 活動記録の登録, 会計との精算行為, 他の部員の活動記録の閲覧
    } else if (
        status?.year === $Enums.Year.Sophomore ||
        status?.year === $Enums.Year.Freshman
    ) {
        return 1; // 活動記録の登録, 会計との精算行為
    } else {
        return 0; // いかなる操作も許容しない
    }
}
