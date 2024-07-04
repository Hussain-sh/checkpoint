import React, { ReactNode } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

interface LayoutProps {
	children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<>
			<div className="flex">
				<Sidebar />
				<div className="flex flex-col w-full">
					<Navbar />
					<main>{children}</main>
				</div>
			</div>
		</>
	);
};

export default Layout;
