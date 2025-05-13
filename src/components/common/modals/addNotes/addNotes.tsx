import { useState } from "react";
import { Loader } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "src/components/ui/dialog";

import { Button } from "src/components/ui/button";
import { addNotes } from "src/server/leads/actions";
import { Lead } from "src/lib/types";
import {
	capitalizeWords,
	cn,
	convertToMinutes,
	filterColors,
} from "src/lib/utils";
import { strings } from "src/lib/strings";

interface Props {
	show: boolean;
	updateLeads: (lead: Lead) => void;
	onClose: () => void;
	lead: Lead | null;
}

function AddNotes({ show, onClose, lead, updateLeads }: Props) {
	const [note, setNote] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const onSubmit = async () => {
		try {
			if (!lead?.id) return;
			setLoading(true);
			const response = await addNotes({
				id: lead?.id,
				content: note,
			});
			if (!response) return setLoading(false);
			updateLeads(response);
			onClose();
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};
	return (
		<Dialog open={show} onOpenChange={() => !loading && onClose()}>
			<DialogContent className='sm:max-w-[600px] max-w-[80vw]'>
				<DialogHeader className='border-b pb-2'>
					<DialogTitle className='text-xl'>
						{strings.table.addNoteModal.addNote}
					</DialogTitle>
					<DialogDescription className='text-primary-button'>
						{strings.table.addNoteModal.callId} {lead?.id}
					</DialogDescription>
				</DialogHeader>
				<div className='flex flex-col justify-start items-start gap-2 border-b pb-2 mt-4'>
					<Details
						heading={strings.table.header.callType}
						value={capitalizeWords(lead?.call_type ?? "")}
						valueColor={
							lead?.call_type ? filterColors[lead?.call_type] : "text-red-400"
						}
					/>
					<Details
						heading={strings.table.header.duration}
						value={lead?.duration ? convertToMinutes(lead.duration) : ""}
					/>
					<Details
						heading={strings.table.header.from}
						value={lead?.from ?? ""}
					/>
					<Details heading={strings.table.header.to} value={lead?.to ?? ""} />
					<Details heading={strings.table.header.via} value={lead?.via ?? ""} />
					<h1 className='font-bold mt-2'>{strings.table.addNoteModal.notes}</h1>
					<textarea
						className='w-full h-32 border border-gray-300 rounded-sm p-2 focus:outline-none focus:ring-1 focus:ring-primary-button text-sm placeholder:text-gray-600'
						placeholder='Add notes'
						value={note}
						onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
							setNote(e.target.value)
						}
					/>
				</div>

				<DialogFooter>
					<Button
						onClick={onSubmit}
						type='submit'
						className='w-full h-12 text-base'
						disabled={loading}
					>
						{loading ? (
							<Loader className='animate-spin text-white m-auto size-lg' />
						) : (
							"Save changes"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default AddNotes;

function Details({
	heading,
	value,
	valueColor,
}: {
	heading: string;
	value: string;
	valueColor?: string;
}) {
	return (
		<div className='flex flex-row justify-start items-center gap-x-2 text-sm w-full'>
			<h1 className={"font-bold w-1/4"}>{heading}:</h1>
			<p className={cn("font-normal  w-3/4", valueColor)}>{value}</p>
		</div>
	);
}
