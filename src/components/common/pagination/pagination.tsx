"use client";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "src/components/ui/pagination";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange?: (page: number) => void;
}

export function PaginationComponent({
	currentPage,
	totalPages,
	onPageChange = () => {},
}: PaginationProps) {
	const getPageNumbers = () => {
		const pages = [];

		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= 3) {
				pages.push(1, 2, 3, 4, "...", totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(
					1,
					"...",
					totalPages - 3,
					totalPages - 2,
					totalPages - 1,
					totalPages
				);
			} else {
				pages.push(
					1,
					"...",
					currentPage - 1,
					currentPage,
					currentPage + 1,
					"...",
					totalPages
				);
			}
		}

		return pages;
	};

	const handleClick = (page: number | string) => {
		if (typeof page === "number" && page !== currentPage) {
			onPageChange(page);
		}
	};

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href='#'
						onClick={(e) => {
							e.preventDefault();
							if (currentPage > 1) onPageChange(currentPage - 1);
						}}
					/>
				</PaginationItem>

				{getPageNumbers().map((page, idx) => (
					<PaginationItem key={idx}>
						{page === "..." ? (
							<PaginationEllipsis />
						) : (
							<PaginationLink
								href='#'
								isActive={page === currentPage}
								size={"sm"}
								className='px-3 py-1 text-xs'
								onClick={(e) => {
									e.preventDefault();
									handleClick(page);
								}}
							>
								{page}
							</PaginationLink>
						)}
					</PaginationItem>
				))}

				<PaginationItem>
					<PaginationNext
						href='#'
						onClick={(e) => {
							e.preventDefault();
							if (currentPage < totalPages) onPageChange(currentPage + 1);
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
