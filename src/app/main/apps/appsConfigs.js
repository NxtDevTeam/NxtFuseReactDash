import AcademyAppConfig from './academy/AcademyAppConfig';
import CalendarAppConfig from './calendar/CalendarAppConfig';
import ChatAppConfig from './chat/ChatAppConfig';
import ContactsAppConfig from './contacts/ContactsAppConfig';
import AnalyticsDashboardAppConfig from './dashboards/analytics/AnalyticsDashboardAppConfig';
import ProjectDashboardAppConfig from './dashboards/project/ProjectDashboardAppConfig';
import ECommerceAppConfig from './e-commerce/ECommerceAppConfig';
import FileManagerAppConfig from './file-manager/FileManagerAppConfig';
import MailAppConfig from './mail/MailAppConfig';
import NotesAppConfig from './notes/NotesAppConfig';
import ScrumboardAppConfig from './scrumboard/ScrumboardAppConfig';
import TodoAppConfig from './todo/TodoAppConfig';
import OrganizationProfileAppConfig from './organization-profile/OrganizationProfileAppConfig';
import CustomDashboardAppConfig from './dashboards/custom/CustomDashboardAppConfig';
import DashboardBuilderAppConfig from './dashboards/builder/DashboardBuilderAppConfig';

const appsConfigs = [
	CustomDashboardAppConfig,
	DashboardBuilderAppConfig,
	OrganizationProfileAppConfig,
	AnalyticsDashboardAppConfig,
	ProjectDashboardAppConfig,
	MailAppConfig,
	TodoAppConfig,
	FileManagerAppConfig,
	ContactsAppConfig,
	CalendarAppConfig,
	ChatAppConfig,
	ECommerceAppConfig,
	ScrumboardAppConfig,
	AcademyAppConfig,
	NotesAppConfig,
];

export default appsConfigs;
