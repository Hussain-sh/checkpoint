import React, { ReactNode } from "react";
import Navbar from "../components/Navbar";

interface LayoutProps {
	children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div>
			<header>
				<Navbar />
			</header>
			<main>{children}</main>
		</div>
	);
};

export default Layout;
