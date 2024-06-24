import React, { ReactNode } from "react";
import BackgrounDesign from "./components/BackgroundDesign";

interface LayoutProps {
	children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<>
			<main>
				<BackgrounDesign>{children}</BackgrounDesign>
			</main>
		</>
	);
};

export default Layout;
