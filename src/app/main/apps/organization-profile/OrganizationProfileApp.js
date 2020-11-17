import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseLoading from '@fuse/core/FuseLoading';
import Error404Page from 'app/main/pages/errors/404/Error404Page';
import OrganizationHeader from './OrganiztionHeader';
// import OrganizationOverview from './OrganizationOverview';
import MemberList from './MemberList';
import {
	fetchOrganization,
	fetchOwnOrganization,
	selectOwnOrganization,
	selectOrganization,
	selectLoadingOwnOrgId,
} from 'app/store/organization/organizationsSlice';
import {
	fetchMemberList,
	selectOrgMembers,
} from 'app/store/organization/membersSlice';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';

function OrganizationProfileApp(props) {
	const dispatch = useDispatch();

	const routeParams = useParams();
	const orgId = routeParams.orgId;
	const ownOrgPage = orgId === 'own';

	// Fetch organization data
	useEffect(() => {
		if (ownOrgPage) {
			dispatch(fetchOwnOrganization());
		} else {
			dispatch(fetchOrganization(orgId));
		}
	}, [dispatch, orgId, ownOrgPage]);

	const organization = useSelector(
		ownOrgPage
			? selectOwnOrganization
			: (state => selectOrganization(state, orgId))
	);

	// orgId may be 'own', this is the actual ID
	const actualOrgId = organization?.data?.id;

	// TODO Fetch at the same time as fetching the main organization data
	// This requires some extra work resolving the own organization ID (which
	// is asynchronous). Maybe instead of special-casing ones own organization
	// in organizationsSlice, resolving the own organization ID could be the
	// responsability of the caller (which can get it from auth/userSlice)
	useEffect(() => {
		if (actualOrgId) {
			dispatch(fetchMemberList(actualOrgId));
		}
	}, [dispatch, actualOrgId]);

	const members = useSelector((state) => selectOrgMembers(state, actualOrgId));

	const loadingOrgId = useSelector(selectLoadingOwnOrgId);

	const loadingOrganization = organization?.loading;

	// TODO Redirect if requesting ones own organization but user does not belong
	// to an organization

	if (loadingOrgId || loadingOrganization) {
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
				content={(members && members.data)
					? <MemberList data={members.data} />
					: <FuseLoading />
				}
			/>
		);
	} else {
		// Organization doesn't exist or user does not have access to it
		return <Error404Page />;
	}
}

export default OrganizationProfileApp;
