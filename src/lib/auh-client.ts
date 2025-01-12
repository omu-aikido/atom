import { createAuthClient } from "better-auth/client";
import { usernameClient, passkeyClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    plugins: [usernameClient()],
});

export const { signIn, signUp, useSession, updateUser, getSession, signOut } =
    createAuthClient({
        plugins: [usernameClient(), passkeyClient()],
    });
