import AcademyAppConfig from './academy/AcademyAppConfig';
import CalendarAppConfig from './calendar/CalendarAppConfig';
import ChatAppConfig from './chat/ChatAppConfig';
import ContactsAppConfig from './contacts/ContactsAppConfig';
import AnalyticsDashboardAppConfig from './dashboards/analytics/AnalyticsDashboardAppConfig';
import ProjectDashboardAppConfig from './dashboards/project/ProjectDashboardAppConfig';
import ECommerceManagementAppConfig from './e-commerce/management/ECommerceManagementAppConfig';
import MarketplaceAppConfig from './e-commerce/marketplace/MarketplaceAppConfig';
import DataLibraryAppConfig from './data-library/DataLibraryAppConfig';
import MailAppConfig from './mail/MailAppConfig';
import NotesAppConfig from './notes/NotesAppConfig';
import ScrumboardAppConfig from './scrumboard/ScrumboardAppConfig';
import TodoAppConfig from './todo/TodoAppConfig';
import OrganizationProfileAppConfig from './organization-profile/OrganizationProfileAppConfig';

const appsConfigs = [
	OrganizationProfileAppConfig,
	AnalyticsDashboardAppConfig,
	ProjectDashboardAppConfig,
	MailAppConfig,
	TodoAppConfig,
	DataLibraryAppConfig,
	ContactsAppConfig,
	CalendarAppConfig,
	ChatAppConfig,
	ECommerceManagementAppConfig,
	MarketplaceAppConfig,
	ScrumboardAppConfig,
	AcademyAppConfig,
	NotesAppConfig,
];

export default appsConfigs;
