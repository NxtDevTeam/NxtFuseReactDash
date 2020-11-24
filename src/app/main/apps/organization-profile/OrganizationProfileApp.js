import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseLoading from '@fuse/core/FuseLoading';
import Error404Page from 'app/main/pages/errors/404/Error404Page';
import OrganizationHeader from './OrganiztionHeader';
// import OrganizationOverview from './OrganizationOverview';
import MemberList from './MemberList';
import { selectOwnOrgId, selectUserData } from 'app/auth/store/userSlice';
import {
	fetchOrganization,
	selectOrganization,
} from 'app/store/organization/organizationsSlice';
import {
	fetchMemberList,
	selectOrgMembers,
} from 'app/store/organization/membersSlice';
import {
	fetchTeamList,
	selectOrgTeams,
} from 'app/store/organization/teamsSlice';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useMemo } from 'react';

function OrganizationProfileApp(props) {
	const dispatch = useDispatch();

	const routeParams = useParams();
	const reqOrgId = routeParams.orgId;
	const ownOrgPage = reqOrgId === 'own';

	const ownOrgId = useSelector(selectOwnOrgId);
	// reqOrgId may be 'own', this is the actual resolved ID
	const actualOrgId = ownOrgPage ? ownOrgId : reqOrgId;

	// Fetch organization data
	useEffect(() => {
		if (actualOrgId) {
			dispatch(fetchOrganization(actualOrgId));
			dispatch(fetchMemberList(actualOrgId));
			dispatch(fetchTeamList(actualOrgId));
		}
	}, [actualOrgId, dispatch]);

	const organization =
		useSelector((state) => selectOrganization(state, actualOrgId));

	const members = useSelector((state) => selectOrgMembers(state, actualOrgId));
	const teams = useSelector((state) => selectOrgTeams(state, actualOrgId));

	// Build the entries to display in the table (join of members and teams)
	const memberListData = useMemo(() => {
		if (!members || members.loading || !teams || teams.loading) {
			return null;
		}

		// key-based view instead of a list of teams
		let teamsMap = {}
		for (let team of teams.data) {
			teamsMap[team.id] = team;
		}

		return members.data.map((member) => ({
			id: member.id,
			name: member.name,
			email: member.email,
			picture: member.picture,
			teamId: member.team_id,
			teamName: member.team_id ? teamsMap[member.team_id]?.name : undefined,
		}));
	}, [members, teams]);

	const userTeam = useSelector(selectUserData)?.teamId;

	const loadingOrganization = organization?.loading;

	// TODO Redirect if requesting ones own organization but user does not belong
	// to an organization

	if (loadingOrganization) {
		// If the organization object does not exist in the store, it hasn't been
		// requested yet, so it is still loading
		return <FuseLoading />;
	} else if (organization?.data) {
		return (
			<FusePageSimple
				classes={{
					contentWrapper: 'p-0 h-full',
					content: 'flex flex-col sm:p-24 h-full',
					// leftSidebar: 'w-256 border-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136',
					wrapper: 'min-h-0'
				}}
				header={<OrganizationHeader organization={organization.data} />}
				content={(memberListData)
					? <MemberList data={memberListData} filterTeamId={userTeam} />
					: <FuseLoading />
				}
				innerScroll
			/>
		);
	} else {
		// Organization doesn't exist or user does not have access to it
		return <Error404Page />;
	}
}

export default OrganizationProfileApp;
