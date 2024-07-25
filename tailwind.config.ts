import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			colors: {
				secondary: "#141522",
				errorColor: "#C92532",
				primaryBorder: "#dce4ff",
				primary: "#546fff",
				successColor: "#9cd323",
				infoDark: "#102e7a",
				iconColor: "#C9D4E4",
				iconColorHover: "rgba(113, 82, 243, 0.05)",
				activeIconColor: "#307EF3",
				grayText: "#7C8DB5",
				checkpointYellow: "#FFDD65",
				checkpointRed: "#FF4423",
			},
		},
	},
	plugins: [],
};
export default config;
