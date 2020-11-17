import React from 'react';
import {
	IconButton,
	TextField,
	Tooltip,
} from '@material-ui/core';
import { AddBox, DeleteForever } from '@material-ui/icons';

import DashletCardBuilder from './DashletCardBuilder';

function AddDashletButton({ onClick }) {
	return (
		<Tooltip title="Add dashlet">
			<IconButton className="self-center" onClick={onClick}>
				<AddBox />
			</IconButton>
		</Tooltip>
	);
}

function DashletRowBuilder({
	title,
	dashlets,
	onChangeTitle,
	onRemove,
	onAddDashlet,
	onRemoveDashlet,
	onChangeDashlet,
}) {
	// Height of the dashlet is dependant on the number of dashlets in the row
	const dashletCount = dashlets.length;
	const heightClasses = dashletCount <= 2 ? 'h-200 sm:h-256' : 'h-96';

	return (
		<div>
			<div className="flex flex-row">
				<TextField
					variant="filled"
					label="Row title"
					value={title}
					onChange={(event) => onChangeTitle(event.target.value)}
				/>

				<Tooltip title="Remove row">
					<IconButton onClick={onRemove}>
						<DeleteForever />
					</IconButton>
				</Tooltip>
			</div>

			<div className="flex flex-col sm:flex-row pb-32">
				{dashlets.map((config, index) => (
					<React.Fragment key={index}>
						<AddDashletButton onClick={() => onAddDashlet(index)} />

						<DashletCardBuilder
							{...config}
							heightClasses={heightClasses}
							onChange={(data) => onChangeDashlet(index, data)}
							onRemove={() => onRemoveDashlet(index)}
						/>
					</React.Fragment>
				))}

				<AddDashletButton onClick={() => onAddDashlet(dashlets.length)}/>
			</div>
		</div>
	);
}

export default React.memo(DashletRowBuilder);
