import FilterDropdown from "src/components/common/filterDropdown/filterDropdown";
import Loading from "src/components/common/loader/loader";
import { PaginationComponent } from "src/components/common/pagination/pagination";
import { strings } from "src/lib/strings";

function LoadingPage() {
	return (
		<div className='p-8 w-screen h-full flex flex-col justify-start items-start'>
			<h1 className='text-[1.75rem] font-medium'>{strings?.title}</h1>
			<FilterDropdown selectedFilter={undefined} disabled />
			<div className='h-full w-full flex flex-col justify-start items-center mt-6'>
				<Loading />
				<div className=' flex flex-col justify-center items-center gap-2'>
					<PaginationComponent currentPage={0} totalPages={0} />
					<p className='text-xs'>
						{0} - {0} {strings.common.of} {0} {strings.common.results}
					</p>
				</div>
			</div>
		</div>
	);
}

export default LoadingPage;
