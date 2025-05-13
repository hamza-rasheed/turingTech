"use client";
import { useCallback, useEffect, useState } from "react";
import { PaginationComponent } from "../pagination/pagination";
import { filters, Lead, limit } from "src/lib/types";
import { archiveLeads, revalidateByTag } from "src/server/leads/actions";
import FilterDropdown from "../filterDropdown/filterDropdown";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "src/components/ui/table";
import { capitalizeWords, convertToMinutes, filterColors } from "src/lib/utils";
import moment from "moment";
import { Button } from "src/components/ui/button";
import AddNotes from "../modals/addNotes/addNotes";
import { useRouter, useSearchParams } from "next/navigation";
import { strings } from "src/lib/strings";

function LeadsTable({
	leads,
	pageNumber,
}: {
	leads: { nodes: Lead[]; hasNextPage: boolean; totalCount: number };
	pageNumber: number;
}) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [allLeads, setLeads] = useState<Lead[]>([]);
	const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
	const [hasNextPage, setHasNextPage] = useState<boolean>(false);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [filter, setFilter] = useState<filters | undefined>(undefined);
	const [openNotes, setOpenNotes] = useState<boolean>(false);
	const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

	const applyFilters = useCallback(
		(value: filters, leadsFetched?: Lead[] | undefined) => {
			const leadsToFilter = leadsFetched ? leadsFetched : allLeads;
			switch (value) {
				case filters.all:
					setFilteredLeads(leadsToFilter);
					break;
				case filters.archive:
					setFilteredLeads(
						leadsToFilter.filter((lead: Lead) => lead.is_archived)
					);
					break;
				case filters.unarchive:
					setFilteredLeads(
						leadsToFilter.filter((lead: Lead) => !lead.is_archived)
					);
					break;
				default:
					setFilteredLeads(leadsToFilter);
					break;
			}
		},
		[allLeads]
	);

	useEffect(() => {
		if (applyFilters && leads && leads?.nodes?.length > 0) {
			setLeads(leads?.nodes);
			setHasNextPage(leads?.hasNextPage);
			setTotalCount(leads?.totalCount);
			applyFilters(filter ?? filters.all, leads?.nodes);
		}
	}, [leads, applyFilters, filter]);

	useEffect(() => setCurrentPage(pageNumber), [pageNumber]);

	const selectFilter = (value: filters) => {
		setFilter(value);
		applyFilters(value);
	};

	const updateLeads = () => {
		revalidateByTag("get-leads");
	};

	const archiveLead = async (id: string) => {
		const response = await archiveLeads({ id });
		if (!response) return;
		updateLeads();
	};

	const goToPage = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", page.toString());
		router.push(`?${params.toString()}`);
	};

	return (
		<>
			<FilterDropdown selectedFilter={filter} onSelectFilter={selectFilter} />
			<div className='h-full w-full flex flex-col justify-start items-center mt-6'>
				<div className='overflow-y-scroll h-full w-full'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='w-1/9'>
									{strings.table.header.callType}
								</TableHead>
								<TableHead className='w-1/9'>
									{strings.table.header.direction}
								</TableHead>
								<TableHead className='w-1/9'>
									{strings.table.header.duration}
								</TableHead>
								<TableHead className='w-1/9'>
									{strings.table.header.from}
								</TableHead>
								<TableHead className='w-1/9'>
									{strings.table.header.to}
								</TableHead>
								<TableHead className='w-1/9'>
									{strings.table.header.via}
								</TableHead>
								<TableHead className='w-1/9'>
									{strings.table.header.createdAt}
								</TableHead>
								<TableHead className='w-1/9'>
									{strings.table.header.status}
								</TableHead>
								<TableHead className='w-1/9'>
									{strings.table.header.actions}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{(filteredLeads.length > 0 ? filteredLeads : allLeads).map(
								(lead) => (
									<TableRow key={lead.id}>
										<TableCell className={filterColors[lead.call_type]}>
											{capitalizeWords(lead.call_type)}
										</TableCell>
										<TableCell className='text-blueColor'>
											{capitalizeWords(lead.direction)}
										</TableCell>
										<TableCell>
											<div className='flex flex-col justify-start items-start'>
												{convertToMinutes(lead.duration)}
												<p className='text-blueColor'>
													({lead.duration} {strings.common.seconds})
												</p>
											</div>
										</TableCell>
										<TableCell>{lead.from}</TableCell>
										<TableCell>{lead.to}</TableCell>
										<TableCell>{lead.via}</TableCell>
										<TableCell>
											{moment(new Date(lead.created_at)).format("DD-MM-YYYY")}
										</TableCell>
										<TableCell>
											<Button
												variant={lead.is_archived ? "secondary" : "gray"}
												onClick={() => archiveLead(lead.id)}
											>
												{lead.is_archived ? "Archive" : "Unarchive"}
											</Button>
										</TableCell>
										<TableCell>
											<Button
												className='text-xs px-2'
												onClick={() => {
													setSelectedLead(lead);
													setOpenNotes(true);
												}}
											>
												{strings.table.addNoteModal.addNote}
											</Button>
										</TableCell>
									</TableRow>
								)
							)}
						</TableBody>
					</Table>
				</div>
				<div className=' flex flex-col justify-center items-center gap-2'>
					<PaginationComponent
						currentPage={currentPage}
						totalPages={Math.ceil(totalCount / limit)}
						onPageChange={(newPage) => {
							if (hasNextPage && newPage !== 0) goToPage(newPage);
						}}
					/>
					<p className='text-xs'>
						{(currentPage - 1) * limit + 1} -{" "}
						{Math.min(currentPage * limit, totalCount)} {strings.common.of}{" "}
						{totalCount} {strings.common.results}
					</p>
				</div>
			</div>
			<AddNotes
				show={openNotes}
				onClose={() => setOpenNotes(false)}
				updateLeads={updateLeads}
				lead={selectedLead}
			/>
		</>
	);
}

export default LeadsTable;
