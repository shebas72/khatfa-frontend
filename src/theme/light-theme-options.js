// Colors

const neutral = {
	90: "#FFFFFF1A",
	100: "#eeced1ff",
	200: "#E5E7EB",
	300: "#F6F7FB",
	400: "#9CA3AF",
	500: "#6B7280",
	600: "#4B5563",
	700: "#374151",
	800: "#1F2937",
	900: "#111827",
	1000: "#ffffff",
	1100: "#D6D6D6",
	1200: "#5e141a",
	1300: "#4a091c",
	1400: "#ffffff"
};

const background = {
	default: "#F9FAFC",
	paper: "#FFFFFF",
	custom: "#f1f2f5",
	custom2: "#FFFFFF",
	custom3: "#F6F7FB",
	custom4: "#ffffff",
	footer1: "#9f9f9f1a",
	footer2: "#9f9f9f0d",
	custom5: "#F4F6F8",
	custom6: "#FCFCFD",
	custom7: "#F6F6F6",
	custom8: "#4a091c",
};

const divider = "#E6E8F0";

const primary = {
	main: "#7f1a24",
	deep: "#541117",
	light: "#EBFDF2",
	dark: "#541117",
	semiLight: "#3f3f3fff",
	contrastText: "#FFFFFF",
	customType1: "#752f35",
	customType2: "#9c4048",
	customType3: "#783d42",
	overLay: "#000000",
	lite: "rgba(3, 157, 85, 0.1)",
	icon: "#7f1a24",
};
const moduleTheme = {
	pharmacy: "#7f1a24",
	ecommerce: "#7f1a24",
	food: "#7f1a24",
	parcel: "#7f1a24",
};
const horizontalCardBG = "#E4FFF3";

const secondary = {
	main: "#9c4048",
	light: "#DA6868",
	dark: "#7f1a24",
	contrastText: "#FFFFFF",
};

const success = {
	main: "#9c4048",
	light: "#DA6868",
	dark: "#7f1a24",
	contrastText: "#FFFFFF",
};

const info = {
	main: "#2196F3",
	light: "#64B6F7",
	dark: "#0B79D0",
	lite: "#DBF5FF",
	contrastText: "#FFFFFF",
	contrastText1: "#F5F6F8",
	blue: "#0D6EFD",
	custom1: "#31C0F5",
};

const warning = {
	main: "#FFB020",
	light: "#FFF8D5",
	lite: "#FFBD8B",
	liter: "#FFF8F2",
	dark: "#FE961C",
	contrastText: "#FFFFFF",
	new: "#FFC817",
};

const error = {
	main: "#D14343",
	light: "#DA6868",
	dark: "#922E2E",
	contrastText: "#FFFFFF",
	deepLight: "#FF725E",
};

const text = {
	primary: "#922E2E",
	secondary: "#93A2AE",
	disabled: "rgba(55, 65, 81, 0.48)",
	custom: "#3F3F3F",
	customText1: "#4B5563",
};

const footer = {
	inputButton: "#DA6868",
	inputButtonHover: "#FF725E",
	bottom: "rgba(0, 98, 52, 0.3)",
	foodBottom: "#686B78",
	appDownloadButtonBg: "#1A1A1A",
	appDownloadButtonBgGray: "#922E2E",
	appDownloadButtonBgHover: "#4f4f4f",
	foodFooterBg: "#414141",
};
const customColor = {
	textGray: "#9c9c9c",
	textGrayDeep: "#787676",
	buyButton: "#F9E091",
	parcelWallet: "#8B3FFD",
};
const whiteContainer = {
	main: "#ffffff",
};
const pink = {
	main: "#FF6D76",
};
const foodCardColor = "#FFF6EF";
const paperBoxShadow = "#E5EAF1";
const roundStackOne = "rgba(255, 255, 255, 0.04)";
const roundStackTwo = "rgba(255, 255, 255, 0.06)";
const toolTipColor = neutral[1000];

export const lightThemeOptions = {
	components: {
		MuiAvatar: {
			styleOverrides: {
				root: {
					backgroundColor: neutral[500],
					color: "#FFFFFF",
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					"&.MuiChip-filledDefault": {
						backgroundColor: neutral[200],
						"& .MuiChip-deleteIcon": {
							color: neutral[400],
						},
					},
					"&.MuiChip-outlinedDefault": {
						"& .MuiChip-deleteIcon": {
							color: neutral[300],
						},
					},
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				input: {
					"&::placeholder": {
						opacity: 1,
						color: text.secondary,
					},
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				notchedOutline: {
					borderColor: divider,
				},
				input: {
					"&:-webkit-autofill": {
						"-webkit-box-shadow": "0 0 0 100px #f0f5f5 inset",
						"-webkit-text-fill-color": "#000",
					},
				},
			},
		},
		MuiMenu: {
			styleOverrides: {
				paper: {
					borderColor: divider,
					borderStyle: "solid",
					borderWidth: 1,
				},
			},
		},
		MuiPopover: {
			styleOverrides: {
				paper: {
					borderColor: divider,
					borderStyle: "solid",
					borderWidth: 1,
				},
			},
		},
		MuiSwitch: {
			styleOverrides: {
				switchBase: {
					color: neutral[500],
				},
				track: {
					backgroundColor: neutral[400],
					opacity: 1,
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					borderBottom: `1px solid ${divider}`,
				},
			},
		},
		MuiTableHead: {
			styleOverrides: {
				root: {
					backgroundColor: neutral[100],
					".MuiTableCell-root": {
						color: neutral[700],
					},
				},
			},
		},
	},
	palette: {
		action: {
			active: neutral[800],
			focus: "rgba(55, 65, 81, 0.12)",
			hover: "rgba(55, 65, 81, 0.04)",
			selected: "rgba(55, 65, 81, 0.08)",
			disabledBackground: "rgba(55, 65, 81, 0.12)",
			disabled: "#fff",
		},
		horizontalCardBG,
		background,
		divider,
		error,
		info,
		mode: "light",
		neutral,
		primary,
		secondary,
		success,
		text,
		warning,
		footer,
		customColor,
		whiteContainer,
		pink,
		paperBoxShadow,
		foodCardColor,
		moduleTheme,
		roundStackOne,
		roundStackTwo,
		toolTipColor,
	},
	shadows: [
		"none",
		"0px 1px 1px rgba(100, 116, 139, 0.06), 0px 1px 2px rgba(100, 116, 139, 0.1)",
		"0px 1px 2px rgba(100, 116, 139, 0.12)",
		"0px 1px 4px rgba(100, 116, 139, 0.12)",
		"0px 1px 5px rgba(100, 116, 139, 0.12)",
		"0px 1px 6px rgba(100, 116, 139, 0.12)",
		"0px 2px 6px rgba(100, 116, 139, 0.12)",
		"0px 3px 6px rgba(100, 116, 139, 0.12)",
		"0px 2px 4px rgba(31, 41, 55, 0.06), 0px 4px 6px rgba(100, 116, 139, 0.12)",
		"0px 5px 12px rgba(100, 116, 139, 0.12)",
		"0px 5px 14px rgba(100, 116, 139, 0.12)",
		"0px 5px 15px rgba(100, 116, 139, 0.12)",
		"0px 6px 15px rgba(100, 116, 139, 0.12)",
		"0px 7px 15px rgba(100, 116, 139, 0.12)",
		"0px 8px 15px rgba(100, 116, 139, 0.12)",
		"0px 9px 15px rgba(100, 116, 139, 0.12)",
		"0px 10px 15px rgba(100, 116, 139, 0.12)",
		"0px 12px 22px -8px rgba(100, 116, 139, 0.25)",
		"0px 13px 22px -8px rgba(100, 116, 139, 0.25)",
		"0px 14px 24px -8px rgba(100, 116, 139, 0.25)",
		"0px 10px 10px rgba(31, 41, 55, 0.04), 0px 20px 25px rgba(31, 41, 55, 0.1)",
		"0px 25px 50px rgba(100, 116, 139, 0.25)",
		"0px 25px 50px rgba(100, 116, 139, 0.25)",
		"0px 25px 50px rgba(100, 116, 139, 0.25)",
		"0px 25px 50px rgba(100, 116, 139, 0.25)",
	],
};
