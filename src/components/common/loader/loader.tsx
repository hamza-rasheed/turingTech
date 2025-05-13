import { Loader } from "lucide-react";

function Loading() {
	return (
		<div className='flex h-full w-full items-center justify-center'>
			<Loader className='animate-spin text-primary' />
		</div>
	);
}

export default Loading;
