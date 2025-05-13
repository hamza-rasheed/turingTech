import { ReactNode } from "react";
import Navbar from "src/components/layouts/navbar/navbar";

interface Props {
	children: ReactNode;
}

function HomeLayout({ children }: Props) {
	return <Navbar showLogoutButton>{children}</Navbar>;
}

export default HomeLayout;
