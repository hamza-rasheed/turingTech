"use client";
import { filters } from "src/lib/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "src/components/ui/select";
import { strings } from "src/lib/strings";

function FilterDropdown({
	selectedFilter,
	onSelectFilter = () => {},
	disabled,
}: {
	selectedFilter: filters | undefined;
	onSelectFilter?: (value: filters) => void;
	disabled?: boolean;
}) {
	return (
		<div className='flex flex-row justify-start items-center gap-x-2'>
			<p className='text-sm font-light'>
				{strings.table.filterDropdown.filterBy}:
			</p>
			<Select
				value={selectedFilter}
				onValueChange={onSelectFilter}
				disabled={disabled}
			>
				<SelectTrigger className='border-none py-0 px-2 text-primary-button'>
					<SelectValue placeholder='Status' />
				</SelectTrigger>
				<SelectContent className='bg-white'>
					<SelectItem value={filters.all}>{filters.all}</SelectItem>
					<SelectItem value={filters.archive}>{filters.archive}</SelectItem>
					<SelectItem value={filters.unarchive}>{filters.unarchive}</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}

export default FilterDropdown;
