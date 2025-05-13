"use server";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { authOptions } from "src/app/api/auth/authOptions";

export async function auth() {
	return await getServerSession(authOptions);
}

export async function getLeads({
	page,
	limit,
}: {
	page: number;
	limit: number;
}) {
	try {
		const session = await auth();
		if (!session?.accessToken) throw new Error("Unauthorized");
		const res = await fetch(
			process.env.NEXTAUTH_BASE_URL + `calls?offset=${page}&limit=${limit}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
				next: {
					tags: ["get-leads"],
				},
			}
		);
		if (!res.ok) throw new Error("Failed to get leads");
		return res.json();
	} catch (err) {
		console.error("[getLeads]:", err);
		return null;
	}
}

export async function archiveLeads({ id }: { id: string }) {
	try {
		const session = await auth();
		if (!session?.accessToken) throw new Error("Unauthorized");
		const res = await fetch(
			process.env.NEXTAUTH_BASE_URL + `calls/${id}/archive`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
			}
		);
		if (!res.ok) throw new Error("Failed to update archive status");
		return res.json();
	} catch (err) {
		console.error("[archiveLeads]:", err);
		return null;
	}
}

export async function addNotes({
	id,
	content,
}: {
	id: string;
	content: string;
}) {
	try {
		const session = await auth();
		if (!session?.accessToken) throw new Error("Unauthorized");
		const res = await fetch(
			process.env.NEXTAUTH_BASE_URL + `calls/${id}/note`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
				body: JSON.stringify({ content }),
			}
		);
		if (!res.ok) throw new Error("Failed to update archive status");
		return res.json();
	} catch (err) {
		console.error("[archiveLeads]:", err);
		return null;
	}
}

export const revalidateByTag = async (tag: string) => {
	revalidateTag(tag);
	return;
};
