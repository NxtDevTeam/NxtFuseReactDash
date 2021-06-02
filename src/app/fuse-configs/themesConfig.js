import { red } from '@material-ui/core/colors';

const themesConfig = {
	dark: {
		palette: {
			type: 'dark',
			primary: {
				light: '#C2C2C3',
				main: '#4f4f4f',
				dark: '#131417',
				contrastText: '#ffffff',
			},
			secondary: {
				main: '#ff6231',
				contrastText: '#ffffff',
			},
			background: {
				paper: '#333333',
				default: '#1E1D1E',
			},
			error: red,
		},
		status: {
			danger: 'orange',
		},
	},
	light: {
		palette: {
			type: 'light',
			primary: {
				main: '#ca2129',
				dark: '#9c0007',
			},
			secondary: {
				main: '#ff6231',
				contrastText: '#ffffff',
			},
			background: {
				paper: '#f2f8f1',
				default: '#ffffff',
			},
			error: red,
		},
		status: {
			danger: 'orange',
		},
	},
	inverse: {
		palette: {
			type: 'dark',
			text: '#ffffff',
			background: {
				paper: '#ca2129',
				default: '#ca2129',
			},
		}
	},
	white: {
		palette: {
			type: 'light',
			background: {
				paper: '#ffffff',
			},
		}
	},
};

export default themesConfig;
