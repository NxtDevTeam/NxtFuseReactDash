import React from	'react';
import { Avatar, IconButton } from '@material-ui/core';
import FuseAnimate from	'@fuse/core/FuseAnimate';
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
];

function MemberList({ data })	{
	return (
		<FuseAnimate animation="transition.slideUpIn"	delay={300}>
			<ContactsTable
				columns={MEMBER_LIST_COLUMNS}
				data={data}
				onRowClick={() => {}}
			/>
		</FuseAnimate>
	);
}

export default MemberList;
