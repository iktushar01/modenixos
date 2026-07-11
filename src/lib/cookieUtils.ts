"use server";

import { cookies } from "next/headers";

const isProduction = process.env.NODE_ENV === "production";

const getCookieConfig = (maxAgeInSeconds: number, httpOnly = true) => ({
    httpOnly,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    path: "/",
    maxAge: maxAgeInSeconds,
});

const getCookieNames = (name: string) => {
    if (name === "better-auth.session_token" && isProduction) {
        return [name, "__Secure-better-auth.session_token"] as const;
    }

    return [name] as const;
};

/**
 * Sets a secure cookie in the browser
 */
export const setCookie = async (
    name : string,
    value : string,
    maxAgeInSeconds : number,
    httpOnly : boolean = true
) => {
    const cookieStore = await cookies();
    const config = getCookieConfig(maxAgeInSeconds, httpOnly);

    for (const cookieName of getCookieNames(name)) {
        cookieStore.set(cookieName, value, config);
    }
};

/**
 * Retrieves a cookie value by name
 */
export const getCookie = async (name : string) => {
    const cookieStore = await cookies();

    for (const cookieName of getCookieNames(name)) {
        const value = cookieStore.get(cookieName)?.value;
        if (value) {
            return value;
        }
    }

    return undefined;
};

/**
 * Deletes a cookie by name
 */
export const deleteCookie = async (name : string) => {
    const cookieStore = await cookies();

    for (const cookieName of getCookieNames(name)) {
        cookieStore.delete(cookieName);
    }
};