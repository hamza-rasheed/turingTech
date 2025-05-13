import LeadsTable from "src/components/common/leadsTable/leadsTable";
import { strings } from "src/lib/strings";
import { Lead, limit } from "src/lib/types";
import { getLeads } from "src/server/leads/actions";

interface Props {
	searchParams: Promise<{ page: string }>;
}

async function Page({ searchParams }: Props) {
	const { page } = await searchParams;
	let pageNumber = 1;
	if (page) pageNumber = parseInt(page);
	const response: {
		nodes: Lead[];
		hasNextPage: boolean;
		totalCount: number;
	} = await getLeads({ page: pageNumber, limit });

	return (
		<div className='p-8 w-screen h-full flex flex-col justify-start items-start'>
			<h1 className='text-[1.75rem] font-medium'>{strings.title}</h1>
			<LeadsTable leads={response} pageNumber={Number(pageNumber)} />
		</div>
	);
}

export default Page;
