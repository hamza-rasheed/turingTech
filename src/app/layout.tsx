import localFont from "next/font/local";
import { ReactNode } from "react";
import { Metadata } from "next";
import { cn } from "src/lib/utils";

import "./globals.css";
import AuthProvider from "src/components/providers/AuthProvider";

interface Props {
	children: ReactNode;
}

export const metadata: Metadata = {
	title: "Turing Technologies",
	description: "Welcome to Turing Technologies",
};

const AvenirDisplay = localFont({
	src: [
		{
			path: "../../public/fonts/AvenirLTStd-Black.otf",
			style: "normal",
		},
		{
			path: "../../public/fonts/AvenirLTStd-Book.otf",
			style: "medium",
		},
		{
			path: "../../public/fonts/AvenirLTStd-Roman.otf",
			style: "bold",
		},
	],
	variable: "--font-avenir",
	display: "swap",
});

async function MainLayout({ children }: Props) {
	return (
		<html lang='en'>
			<body
				className={cn(
					`${AvenirDisplay.variable} ${AvenirDisplay.className}`,
					"text-eerie-black font-normal"
				)}
			>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}

export default MainLayout;
