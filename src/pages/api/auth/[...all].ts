import { auth } from "@/src/lib/auth";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (ctx) => {
    return auth.handler(ctx.request);
};

export const ALL: APIRoute = async (ctx) => {
    try {
        return await auth.handler(ctx.request);
    } catch (error) {
        if (error instanceof Error) {
            return new Response(
                JSON.stringify({
                    error: error.message,
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        } else {
            return new Response(
                JSON.stringify({
                    error: "Unknown error",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }
    }
};
