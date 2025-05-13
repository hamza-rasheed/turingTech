import { JWT } from "next-auth/jwt";
import {
	type NextAuthOptions,
	type User,
	type Account,
	type Profile,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login, refreshAccessToken } from "src/server/user/actions";

export interface ExtendedToken extends JWT {
	accessToken: string;
	refreshToken: string;
	accessTokenExpires: number;
	username?: string;
	error?: string;
}

interface AuthorizedUser {
	id: string;
	username: string;
	accessToken: string;
	refreshToken: string;
	accessTokenExpires: number;
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password) return null;
				const data = await login({
					username: credentials?.username,
					password: credentials?.password,
				});

				return {
					id: data.user.id,
					username: data.user.username,
					accessToken: data.access_token,
					refreshToken: data.refresh_token,
					accessTokenExpires: Date.now() + 8 * 60 * 1000, // I am adding 8 minutes instead of 10 minutes for buffer time
				};
			},
		}),
	],

	session: {
		strategy: "jwt",
		maxAge: 60 * 60, // 60 mins
	},

	callbacks: {
		async jwt({
			token,
			user,
		}: {
			token: JWT;
			user?: User;
			account: Account | null;
			profile?: Profile;
			trigger?: "signIn" | "signUp" | "update";
			isNewUser?: boolean;
		}): Promise<JWT> {
			const customToken = token as ExtendedToken;
			if (user && (user as AuthorizedUser).accessToken) {
				const u = user as AuthorizedUser;
				return {
					...token,
					accessToken: u.accessToken,
					refreshToken: u.refreshToken,
					accessTokenExpires: u.accessTokenExpires,
					username: u.username,
				};
			}

			if (Date.now() < customToken.accessTokenExpires) return customToken;

			const refreshedToken = await refreshAccessToken(customToken);
			return refreshedToken;
		},
		async session({ session, token }) {
			const customToken = token as ExtendedToken;
			session.user = {
				id: token.sub!,
				username: customToken.username!,
			};
			session.accessToken = customToken.accessToken;
			session.refreshToken = customToken.refreshToken;
			session.error = customToken.error;
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};

declare module "next-auth" {
	interface Session {
		accessToken: string;
		refreshToken: string;
		error?: string;
		user?: User;
	}

	interface User {
		id?: string;
		username?: string;
	}
}
