"use client";
import { ReactNode, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "src/components/ui/button";
import { strings } from "src/lib/strings";

function Navbar({
	children,
	showLogoutButton,
}: {
	children: ReactNode;
	showLogoutButton?: boolean;
}) {
	const router = useRouter();
	const { update, data } = useSession();

	const handleLogout = async (e?: React.MouseEvent<HTMLButtonElement>) => {
		if (e) e.preventDefault();
		await signOut({ redirect: false });
		await update();
		router.push("/");
	};

	useEffect(() => {
		if (handleLogout && data?.error && data?.error !== "") handleLogout();
	}, [data, handleLogout]);

	return (
		<div className='h-screen w-screen'>
			<div className='h-[7vh] w-screen px-4 flex flex-row justify-between items-center border-b'>
				<Image
					src={"/logo.png"}
					width={315}
					height={38}
					alt='logo'
					className='object-contain w-[20vw] h-10'
				/>
				{showLogoutButton && (
					<Button className='px-6 h-10 text-base' onClick={handleLogout}>
						{strings.buttons.logout}
					</Button>
				)}
			</div>
			<div className='!h-[93vh] w-full flex flex-col justify-start items-start'>
				{children}
			</div>
		</div>
	);
}

export default Navbar;
