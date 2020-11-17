import React, { useState, useCallback } from 'react';
import {
	Button,
	Card,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Tooltip,
	Typography,
} from '@material-ui/core';
import { DeleteForever, Settings } from '@material-ui/icons';
import clsx from 'clsx';

import dashletsConfig from 'app/fuse-configs/dashletsConfig';
import dataSources from './dataSources';

function DashletConfigDialog({
	open,
	title,
	type,
	input,
	onClose,
	onChange,
}) {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Configure dashlet</DialogTitle>

			<DialogContent className="flex flex-col">
				<TextField
					variant="filled"
					label="Title"
					value={title}
					onChange={(event) => onChange({ title: event.target.value })}
				/>

				<FormControl>
					<InputLabel id="dashlet-type-select-label">Dashlet type</InputLabel>
					<Select
						value={type ?? ''}
						labelId="dashlet-type-select-label"
						onChange={(event) => onChange({ type: event.target.value })}
					>
						<MenuItem value="" />
						{Object.entries(dashletsConfig).map(([value, { name }]) => (
							<MenuItem
								key={value}
								value={value}
							>
								{name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl>
					<InputLabel id="dashlet-input-select-label">Data source</InputLabel>
					<Select
						value={input ? input.id : ''}
						labelId="dashlet-input-select-label"
						onChange={(event) => onChange({
							input: dataSources[event.target.value],
						})}
					>
						<MenuItem value="" />
						{Object.entries(dataSources).map(([value, { name }]) => (
							<MenuItem
								key={value}
								value={value}
							>
								{name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}

function DashletCardBuilder({
	title,
	type,
	options,
	input,
	heightClasses,
	onChange,
	onRemove,
}) {
	const dashlet = dashletsConfig[type];

	const [dialogOpen, setDialogOpen] = useState(false);

	const openDialog = useCallback(() => {
		setDialogOpen(true);
	}, [setDialogOpen]);

	const closeDialog = useCallback((result) => {
		setDialogOpen(false);
	}, [setDialogOpen]);

	const onChangeTitle = useCallback((event) => {
		onChange({
			title: event.target.value,
		});
	}, [onChange]);

	return (
		<div className="flex-1 min-w-0 p-16 pb-0">
			<Card className="p-16 rounded-8 shadow-1">
				<div className="flex flex-row">
					<TextField
						variant="filled"
						label="Title"
						value={title}
						onChange={onChangeTitle}
					/>

					<Tooltip title="Configure">
						<IconButton onClick={openDialog}>
							<Settings />
						</IconButton>
					</Tooltip>

					<Tooltip title="Remove dashlet">
						<IconButton onClick={onRemove}>
							<DeleteForever />
						</IconButton>
					</Tooltip>
				</div>

				<div className={clsx(heightClasses, 'relative', 'w-full')}>
					{dashlet && input
						? <dashlet.component input={input.data} options={options} />
						:
							<Typography align="center" variant="h6" className="pt-16">
								Dashlet not yet configured
							</Typography>
					}
				</div>
			</Card>

			<DashletConfigDialog
				open={dialogOpen}
				title={title}
				type={type}
				input={input}
				onClose={closeDialog}
				onChange={onChange}
			/>
		</div>
	);
}

export default React.memo(DashletCardBuilder);
