import React, { useMemo, useState } from 'react';
import FuseAnimate from '@fuse/core/FuseAnimate';
import {
	Avatar,
	InputAdornment,
	InputLabel,
	FormControl,
	MenuItem,
	Select,
	TextField,
	Button,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import ContactsTable from 'app/main/apps/contacts/ContactsTable.js';
import InviteDialog from './InviteDialog';

const MEMBER_LIST_COLUMNS = [
	{
		accessor: 'picture',
		Cell: ({ row }) => (
			<Avatar
				className="mx-8"
				alt={row.original.name}
				src={row.original.picture}
			/>
		),
		width: 64,
		sortable: false,
	},
	{
		Header: 'Name',
		accessor: 'name',
		className: 'font-bold',
		sortable: true,
	},
	{
		Header: 'Email',
		accessor: 'email',
		className: 'font-bold',
		sortable: true,
	},
	{
		Header: 'Team',
		accessor: 'teamName',
		className: 'font-bold',
		sortable: true,
	},
	{
		// Hidden column for filtering
		accessor: 'teamId',
		isVisible: false,
		Cell: () => null,
	},
];

function lowerCaseContains(string, search) {
	return string && string.toLowerCase && string.toLowerCase().includes(search);
}

function matchesTeamFilter(row, filterType, teamId) {
	switch (filterType) {
		case 'organization':
			// TODO Add in org ID so it can be filtered on. Only applicable if
			// "external" contacts exist.
			return true;
		case 'team':
			return row.values.teamId === teamId;
		default:
			return true;
	}
}

const filterTypes = {
	textAndTeam: (rows, ids, { searchText, teamId, filterType }) =>
		rows.filter((row) => {
			const lowerSearchText = searchText.toLowerCase();
			const matchesSearch =
				ids.some((id) => lowerCaseContains(row.values[id], lowerSearchText));

			return matchesSearch && matchesTeamFilter(row, filterType, teamId);
		}),
};

function MemberList({ orgId, orgName, data, filterTeamId }) {
	const [searchText, setSearchText] = useState('');

	const [filterType, setFilterType] = useState('all');

	const filterValue = useMemo(() => ({
		searchText,
		filterType,
		teamId: filterTeamId,
	}), [searchText, filterTeamId, filterType]);

	const [inviteDialogOpen, openInviteDialog] = useState(false);

	return (
		<>
			<FuseAnimate animation="transition.slideUpIn" delay={300}>
				<div className="flex flex-col">
					<div className="flex py-16">
						<TextField
							placeholder="Search for members"
							value={searchText}
							onChange={(event) => setSearchText(event.target.value)}
							className="px-16"
							variant="outlined"
							InputProps={{
								'aria-label': 'Search',
								startAdornment: (
									<InputAdornment>
										<Search color="action" />
									</InputAdornment>
								),
							}}
						/>

						<FormControl variant="outlined">
							<InputLabel id="member-list-filter-label">Filter</InputLabel>
							<Select
								id="member-list-filter-select"
								labelId="member-list-filter-label"
								label="Filter"
								className="px-16"
								value={filterType}
								onChange={(event) => setFilterType(event.target.value)}
							>
								<MenuItem value="all">All</MenuItem>
								<MenuItem value="organization">My Organization</MenuItem>
								{filterTeamId ?
									<MenuItem value="team">My Team</MenuItem>
									: null
								}
							</Select>
						</FormControl>

						<div className="flex-1 flex justify-end">
							<Button
								className="px-16"
								variant="contained"
								onClick={() => openInviteDialog(true)}
							>
								Invite Members
						</Button>
						</div>
					</div>

					<ContactsTable
						columns={MEMBER_LIST_COLUMNS}
						data={data}
						initialState={{
							sortBy: [{ id: 'name' }],
						}}
						filterTypes={filterTypes}
						globalFilter="textAndTeam"
						globalFilterValue={filterValue}
						onRowClick={() => { }}
					/>
				</div>
			</FuseAnimate>

			<InviteDialog
				open={inviteDialogOpen}
				onClose={() => openInviteDialog(false)}
				orgId={orgId}
				orgName={orgName}
			/>
		</>
	);
}

export default MemberList;
