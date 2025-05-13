"use server";
import { ExtendedToken } from "src/app/api/auth/authOptions";

export const login = async ({
	username,
	password,
}: {
	username: string;
	password: string;
}) => {
	try {
		const res = await fetch(process.env.NEXTAUTH_BASE_URL + "auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		});
		if (!res.ok) throw new Error("Failed to login");
		const response = await res.json();
		return response;
	} catch (error) {
		console.error("Error logging in:", error);
		return null;
	}
};

export async function refreshAccessToken(token: ExtendedToken) {
	try {
		const res = await fetch(
			process.env.NEXTAUTH_BASE_URL + "auth/refresh-token",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token?.accessToken}`,
				},
			}
		);
		if (!res.ok) throw new Error("Failed to refresh token");
		const refreshed = await res.json();
		return {
			...token,
			accessToken: refreshed.access_token,
			accessTokenExpires: Date.now() + 8 * 60 * 1000,
		};
	} catch (err) {
		console.error("Token refresh error:", err);
		return {
			...token,
			error: "RefreshAccessTokenError",
		};
	}
}
