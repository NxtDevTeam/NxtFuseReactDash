import { red } from '@material-ui/core/colors';

const themesConfig = {
	dark: {
		palette: {
			type: 'dark',
			primary: {
				light: '#C2C2C3',
				main: '#323338',
				dark: '#131417',
			},
			secondary: {
				main: '#7500d9',
				contrastText: '#FFFFFF',
			},
			background: {
				paper: '#262526',
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
				main: '#3344cc',
			},
			secondary: {
				main: '#00ccff',
				contrastText: '#1E1F23',
			},
			background: {
				paper: '#FAF6F3',
				default: '#FFFFFF',
			},
			error: red,
		},
		status: {
			danger: 'orange',
		},
	},
};

export default themesConfig;
