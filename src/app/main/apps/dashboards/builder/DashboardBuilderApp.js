import React from 'react';
import FuseAnimate from '@fuse/core/FuseAnimate';
import { Button } from '@material-ui/core';
import { AddBox } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';

import DashletRowBuilder from './DashletRowBuilder';
import dashboardLayoutReducer from './store';
import {
	selectDashboardLayout,
	addDashletRow,
	removeDashletRow,
	setDashletRowTitle,
	addDashlet,
	removeDashlet,
	updateDashlet,
} from './store/dashboardLayoutSlice';
import dataSources from './dataSources';

function AddRowButton({ onClick }) {
	return (
		<Button className="self-center" startIcon={<AddBox />} onClick={onClick}>
			Add row
		</Button>
	);
}

function DashboardBuilderApp() {
	const dispatch = useDispatch();

	const dashboardLayout = useSelector(selectDashboardLayout);

	return (
		<div className="w-full">
			<FuseAnimate animation="transition.slideUpIn" delay={200}>
				<div className="flex flex-col sm:p-8">
					{dashboardLayout.rows.map(({ title, dashlets }, index) => (
						<React.Fragment key={index}>
							<AddRowButton onClick={() => dispatch(addDashletRow(index))} />

							<DashletRowBuilder
								title={title}
								dashlets={dashlets}
								onChangeTitle={(title) =>
									dispatch(setDashletRowTitle({ title, index }))
								}
								onRemove={() => dispatch(removeDashletRow(index))}
								onAddDashlet={(col) => dispatch(addDashlet({
									row: index,
									col,
								}))}
								onRemoveDashlet={(col) => dispatch(removeDashlet({
									row: index,
									col,
								}))}
								onChangeDashlet={(col, data) => dispatch(updateDashlet({
									row: index,
									col,
									data,
								}))}
							/>
						</React.Fragment>
					))}

					<AddRowButton
						onClick={() => dispatch(addDashletRow(dashboardLayout.rows.length))}
					/>
				</div>
			</FuseAnimate>
		</div>
	);
}

export default withReducer(
	'dashboardBuilderApp', dashboardLayoutReducer
)(DashboardBuilderApp);
