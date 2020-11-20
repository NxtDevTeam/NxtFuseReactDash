import React, { useMemo, useState } from	'react';
import { Avatar, IconButton } from '@material-ui/core';
import FuseAnimate from	'@fuse/core/FuseAnimate';
import {
	Checkbox,
	InputAdornment,
	FormControlLabel,
	TextField,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import ContactsTable from	'app/main/apps/contacts/ContactsTable.js';

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

const filterTypes = {
	textAndTeam: (rows, ids, { searchText, teamId }) => rows.filter((row) => {
		const lowerSearchText = searchText.toLowerCase();

		return (
			(!teamId || row.values.teamId === teamId)
			&& ids.some((id) => lowerCaseContains(row.values[id], lowerSearchText))
		);
	}),
};

function MemberList({ data, filterTeamId })	{
	const [searchText, setSearchText] = useState('');

	const [applyTeamFilter, setApplyTeamFilter] = useState(false);

	const filterValue = useMemo(() => ({
		searchText,
		teamId: applyTeamFilter ? filterTeamId : null,
	}), [searchText, filterTeamId, applyTeamFilter]);

	return (
		<FuseAnimate animation="transition.slideUpIn"	delay={300}>
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

					{filterTeamId
						?
							<FormControlLabel
								control={
									<Checkbox
										name="only-my-team"
										checked={applyTeamFilter}
										onChange={(event) => setApplyTeamFilter(event.target.checked)}
									/>
								}
								label="Only show my team"
							/>
						: null
					}
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
					onRowClick={() => {}}
				/>
			</div>
		</FuseAnimate>
	);
}

export default MemberList;
