import Image from "next/image";
import bgImage from "../../../assets/images/background.jpg";
const BackgroundDesign: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return (
		<>
			<div className="h-screen w-full flex justify-center items-center relative overflow-hidden">
				<div className="absolute -top-52 -left-48 w-[28rem] h-[28rem] rounded-full bg-white flex items-center justify-center opacity-50 z-10"></div>
				<div className="absolute -bottom-52 -right-28 w-[28rem] h-[28rem] rounded-full bg-white flex items-center justify-center opacity-50 z-10"></div>
				<Image
					src={bgImage}
					alt="background-img"
					fill
					className="object-cover z-0"
				/>
				<div className="absolute inset-0 bg-black opacity-75 z-10"></div>
				{children}
			</div>
		</>
	);
};
export default BackgroundDesign;
