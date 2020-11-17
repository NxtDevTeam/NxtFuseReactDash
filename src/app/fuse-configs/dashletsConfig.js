import BarChart from 'app/main/apps/dashboards/dashlets/BarChart';
import LineChart from 'app/main/apps/dashboards/dashlets/LineChart';
import PieChart from 'app/main/apps/dashboards/dashlets/PieChart';

/**
 * Collection of available dashlet types and their metadata.
 */
const dashletsConfig = {
	'bar': {
		name: 'Bar Chart',
		component: BarChart,
	},
	'line': {
		name: 'Line Graph',
		component: LineChart,
	},
	'pie': {
		name: 'Pie Chart',
		component: PieChart,
	},
};

export default dashletsConfig;
