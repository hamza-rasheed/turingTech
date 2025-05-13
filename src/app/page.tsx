"use client";
import { HTMLInputTypeAttribute, ReactNode, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LockKeyhole, User } from "lucide-react";

import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import Navbar from "src/components/layouts/navbar/navbar";
import { routes } from "src/lib/routes";
import { strings } from "src/lib/strings";
import Loading from "src/components/common/loader/loader";

function Main() {
	const router = useRouter();
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const handleLogin = async (e: React.FormEvent) => {
		setLoading(true);
		e.preventDefault();
		setError("");
		const res = await signIn("credentials", {
			redirect: false,
			username,
			password,
		});
		setLoading(false);
		if (res?.error) setError("Invalid username or password");
		else router.push(routes.home);
	};

	return (
		<Navbar>
			<div className='p-6 bg-red-50/60 w-full h-full flex justify-center items-center'>
				<form
					className='w-[40vw] bg-white border flex flex-col justify-start items-start p-8 py-12 gap-4'
					onSubmit={handleLogin}
				>
					<h1>{strings.login.username}</h1>
					<InputWithEmoji
						icon={<User />}
						value={username}
						placeholder={strings.login.username}
						setValue={setUsername}
					/>
					<h1>{strings.login.password}</h1>
					<InputWithEmoji
						icon={<LockKeyhole />}
						value={password}
						placeholder={strings.login.password}
						setValue={setPassword}
						type='password'
					/>
					{error && error !== "" && <span>Error: {error}</span>}
					{loading ? (
						<div className='w-fit h-10 mt-4 px-2'>
							<Loading />
						</div>
					) : (
						<Button
							type='submit'
							className='bg-blue-500 text-base mt-4 h-10 px-4'
						>
							{strings.buttons.login}
						</Button>
					)}
				</form>
			</div>
		</Navbar>
	);
}

export default Main;

function InputWithEmoji({
	icon,
	value,
	setValue,
	placeholder,
	type,
}: {
	icon: ReactNode;
	placeholder?: string;
	value: string;
	setValue: (value: string) => void;
	type?: HTMLInputTypeAttribute | undefined;
}) {
	return (
		<div className='flex flex-row justify-start items-center pl-2 border w-full '>
			{icon}
			<Input
				className='border-none outline-none'
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder={placeholder}
				type={type}
			/>
		</div>
	);
}
