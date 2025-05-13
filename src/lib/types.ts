export enum filters {
	all = "All",
	archive = "Archive",
	unarchive = "Unarchive",
}

export enum callType {
	voicemail = "voicemail",
	answered = "answered",
	missed = "missed",
}

export interface Lead {
	call_type: callType;
	created_at: string;
	direction: string;
	duration: number;
	from: string;
	id: string;
	is_archived: boolean;
	notes: Note[];
	to: string;
	via: string;
}
interface Note {
	content: string;
	id: string;
}

export const limit = 8;
