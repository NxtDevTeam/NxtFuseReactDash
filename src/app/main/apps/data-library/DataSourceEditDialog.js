import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Icon,
	MenuItem,
	makeStyles,
	Typography,
} from '@material-ui/core';
import { dataSourceTypes, getRandomDataSourceSize, getSourceTypeData } from './dataSourceUtils';
import Formsy from 'formsy-react';
import { SelectFormsy, TextFieldFormsy } from '@fuse/core/formsy';
import ColorPickerFormsy from '@fuse/core/formsy/ColorPickerFormsy';

const useStyles = makeStyles({
	formInput: {
		marginTop: 8,
		marginBottom: 16,
	},
});

function DataSourceSpecificOptionsForm({ options, initialValue }) {
	const classes = useStyles();

	initialValue = initialValue ?? {};

	return (
		<div className="flex flex-col flex-1">
			{options
				? options.map(({ name, text, required }) => (
					<TextFieldFormsy
						key={name}
						variant="outlined"
						className={classes.formInput}
						required={required}
						name={`options.${name}`}
						label={text}
						value={initialValue[name]}
					/>
				))
				: <Typography>
					Select a valid data source type to configure it
					</Typography>
			}
		</div>
	);
}

function DataSourceEditDialog({
	open,
	onClose,
	initialValue,
	onSave,
}) {
	const [submitEnabled, setSubmitEnabled] = useState(false);

	const enableSubmit = useCallback(
		() => setSubmitEnabled(true),
		[setSubmitEnabled]);

	const disableSubmit = useCallback(
		() => setSubmitEnabled(false),
		[setSubmitEnabled]);


	// Set the title based on whether initial values are passed
	const isCreateDialog = !initialValue;
	const title = isCreateDialog ? 'New Data Sourcce' : 'Edit Data Source';
	const submitButtonLabel = isCreateDialog ? 'Create' : 'Save';
	initialValue = initialValue ?? {
		type: '',
		name: '',
		color: null,
		options: {},
	};

	const [sourceTypeData, setSourceTypeData] = useState(getSourceTypeData(
		initialValue.type
	));
	const { icon: typeIcon, options } = sourceTypeData;

	// Update the type metadata when the initial values change (i.e. when a new
	// dialog is opened) and when the form is updated.
	const initialType = initialValue.type;
	useEffect(() => {
		setSourceTypeData(getSourceTypeData(initialType));
	}, [initialType]);

	const handleFormChange = useCallback((values) => {
		setSourceTypeData(getSourceTypeData(values.type));
	}, [setSourceTypeData]);

	// Since the button is in the <DialogActions> container, it cannot be inside
	// the <Formsy> wrapper, so we need a ref to the formsy instance in order to
	// pull the data from it
	const formRef = useRef(null);
	const handleSubmit = useCallback(() => {
		// Inject the size field into the request (this is just placeholder data
		// for now, so the size might as well just be random)
		onSave({
			...formRef.current.getModel(),
			size: getRandomDataSourceSize(),
		});
		onClose();
	}, [onSave, onClose]);

	const classes = useStyles();

	return (
		<Dialog fullWidth open={open} onClose={onClose}>
			<DialogTitle>{title}</DialogTitle>

			<DialogContent>
				<Formsy
					ref={formRef}
					onValid={enableSubmit}
					onInvalid={disableSubmit}
					onChange={handleFormChange}
					className="flex flex-row"
				>
					<div className="flex flex-col flex-1">
						<Icon className="text-96 self-center">{typeIcon}</Icon>

						<SelectFormsy
							variant="outlined"
							className={classes.formInput}
							required
							label="Data Source Type"
							name="type"
							value={initialValue.type}
						>
							<MenuItem value=""></MenuItem>

							{Object.entries(dataSourceTypes).map(([type, typeData]) => (
								<MenuItem
									key={type}
									value={type}
								>
									{typeData.name}
								</MenuItem>
							))}
						</SelectFormsy>

						<TextFieldFormsy
							variant="outlined"
							className={classes.formInput}
							required
							name="name"
							label="Name"
							value={initialValue.name}
						/>

						<ColorPickerFormsy
							variant="outlined"
							className={classes.formInput}
							name="color"
							label="Color"
							value={initialValue.color}
							ColorPickerProps={{
								disableAlpha: true,
							}}
							validations="isColor"
							validationError="Not a valid color"
						/>
					</div>

					<Divider className="mx-16" orientation="vertical" flexItem />

					<DataSourceSpecificOptionsForm
						options={options}
						initialValue={initialValue.options}
					/>
				</Formsy>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>
					Cancel
				</Button>

				<Button
					variant="contained"
					color="primary"
					disabled={!submitEnabled}
					onClick={handleSubmit}
				>
					{submitButtonLabel}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default DataSourceEditDialog;
