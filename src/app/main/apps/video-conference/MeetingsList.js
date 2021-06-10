import React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import moment from 'moment';

const DATE_FORMAT = 'MM/DD/YY';
const TIME_FORMAT = 'hh:mm A';

const columns = [
	{
		field: 'title',
		headerName: 'Meeting Name',
		width: 300,
	},
	{
		field: 'date',
		headerName: 'Date',
		width: 120,
		valueGetter: (params) =>
			moment(params.row.start).format(DATE_FORMAT),
	},
	{
		field: 'start_time',
		headerName: 'Start',
		width: 120,
		valueGetter: (params) =>
			moment(params.row.start).format(TIME_FORMAT),
	},
	{
		field: 'end_time',
		headerName: 'End',
		width: 120,
		valueGetter: (params) =>
			moment(params.row.end).format(TIME_FORMAT),
	},
];

function MeetingsList({
	className,
	selectedMeeting,
	onSelectMeeting,
	meetings,
}) {
	function handleSelectRow({ isSelected, data }) {
		onSelectMeeting(isSelected ? data : null);
	}

	return (
		<DataGrid
			className={className}
			density="compact"
			autoHeight
			pageSize={5}
			checkboxSelection={false}
			selectionModel={selectedMeeting ? [selectedMeeting.id] : []}
			onRowSelected={handleSelectRow}
			columns={columns}
			rows={meetings}
		/>
	);
}

export default MeetingsList;
