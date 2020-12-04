import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { createDataSource } from './store/dataSourcesSlice';
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

function DataSourceSpecificOptionsForm({ options }) {
	const classes = useStyles();

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
					/>
				))
				: <Typography>
					Select a valid data source type to configure it
					</Typography>
			}
		</div>
	);
}

function NewDataSourceDialog({ open, onClose }) {
	const dispatch = useDispatch();

	const [submitEnabled, setSubmitEnabled] = useState(false);

	const enableSubmit = useCallback(
		() => setSubmitEnabled(true),
		[setSubmitEnabled]);

	const disableSubmit = useCallback(
		() => setSubmitEnabled(false),
		[setSubmitEnabled]);

	const [sourceTypeData, setSourceTypeData] = useState(getSourceTypeData(null));
	const { icon: typeIcon, options } = sourceTypeData;

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
		dispatch(createDataSource({
			...formRef.current.getModel(),
			size: getRandomDataSourceSize(),
		}));
		onClose();
	}, [dispatch, onClose]);

	const classes = useStyles();

	return (
		<Dialog fullWidth open={open} onClose={onClose}>
			<DialogTitle>New Data Source</DialogTitle>

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
							value=""
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
						/>

						<ColorPickerFormsy
							variant="outlined"
							className={classes.formInput}
							name="color"
							label="Color"
							ColorPickerProps={{
								disableAlpha: true,
							}}
							validations="isColor"
							validationError="Not a valid color"
						/>
					</div>

					<Divider className="mx-16" orientation="vertical" flexItem />

					<DataSourceSpecificOptionsForm options={options} />
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
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default NewDataSourceDialog;
