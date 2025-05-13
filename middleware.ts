import { NextRequest, NextResponse } from "next/server";
import { routes } from "src/lib/routes";

function decodeJwtPayload(token: string): any | null {
	try {
		const payloadBase64 = token.split(".")[1];
		const decoded = atob(payloadBase64);
		return JSON.parse(decoded);
	} catch (e) {
		console.error("Failed to decode token", e);
		return null;
	}
}

export async function middleware(request: NextRequest) {
	const token =
		request.cookies.get("next-auth.session-token")?.value ||
		request.cookies.get("__Secure-next-auth.session-token")?.value;
	const requestUrl = request.nextUrl.pathname;
	const loginUrl = new URL(routes.login, new URL(request.url).origin);
	const homeUrl = new URL(routes.home, new URL(request.url).origin);
	const isAuthenticated = !!token;
	let isTokenExpired = true;

	if (token) {
		const payload = decodeJwtPayload(token);
		if (payload && payload.exp) {
			const now = Math.floor(Date.now() / 1000);
			isTokenExpired = payload.exp < now;
		}
	}

	if ((!isAuthenticated || isTokenExpired) && requestUrl === routes.login) {
		return NextResponse.next();
	} else if (isAuthenticated && !isTokenExpired) {
		if (request.url !== routes.home) return NextResponse.redirect(homeUrl);
		else return NextResponse.next();
	} else return NextResponse.redirect(loginUrl);
}

export const config = {
	matcher: ["/", "/home"],
};
