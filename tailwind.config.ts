import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/features/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "#232323",
					button: "#4F46F8",
					light: "#A8AAAC",
					// medium: "#68BAF6",
					// dark: "#092f4e",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "#F4F4F9",
					foreground: "hsl(var(--secondary-foreground))",
				},
				border: "hsl(var(--border))",
				blueColor: "#325AE7",
				greenColor: "#1DC9B7",
				greenLight: "#1DC9B714",
				redShade: "#C91D3E",
			},
			fontFamily: {
				avenir: ["var(--font-avenir)"],
			},
		},
	},
	plugins: [animate],
};
export default config;
