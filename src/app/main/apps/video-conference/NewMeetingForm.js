import { Button, FormControlLabel, Radio, Tab, Tabs, Typography } from '@material-ui/core';
import clsx from 'clsx';
import Formsy from 'formsy-react';
import React, { useCallback, useRef, useState } from 'react';
import {
	DatePickerFormsy,
	RadioGroupFormsy,
	TextFieldFormsy,
	TimePickerFormsy,
} from '@fuse/core/formsy';
import { UserSelectFormsy } from './UserSelectInput';

function TabPanel({ value, index, children }) {
	return (
		<div className="w-100p" hidden={index !== value}>
			{children}
		</div>
	);
}

const formInputClass = 'm-8';

function NewMeetingForm({
	className,
	onCancel,
	onSubmit,
}) {
	const [submitEnabled, setSubmitEnabled] = useState(false);

	const enableSubmit = useCallback(
		() => setSubmitEnabled(true),
		[setSubmitEnabled]);

	const disableSubmit = useCallback(
		() => setSubmitEnabled(false),
		[setSubmitEnabled]);

	const formRef = useRef();

	// When times are changed to be in the wrong order, show errors indicating it
	function checkTimeOrdering() {
		const form = formRef.current;
		const { start_time, end_time } = form.getModel();
		if (start_time && end_time && end_time.isBefore(start_time)) {
			const message = 'Start time after end time';
			form.updateInputsWithError({
				start_time: message,
				end_time: message,
			});
		}
	}

	const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

	const [currentTab, setCurrentTab] = useState(0);

	return (
		<Formsy
			ref={formRef}
			className={clsx(className, "flex flex-col")}
			onValid={enableSubmit}
			onInvalid={disableSubmit}
			onValidSubmit={onSubmit}
		>
			<div className="flex flex-1">
				<div className="flex-1 mr-8">
					<Typography variant="h6">
						Schedule a Meeting
					</Typography>

					<TextFieldFormsy
						className={formInputClass}
						variant="outlined"
						required
						name="title"
						label="Meeting Name"
						placeholder="Enter a meeting name"
					/>

					<div className="flex">
						<DatePickerFormsy
							className={formInputClass}
							inputVariant="outlined"
							required
							name="date"
							label="Date"
							format="MM/DD/YYYY"
							placeholder="MM/DD/YYYY"
							value={null}
						/>

						<TimePickerFormsy
							className={formInputClass}
							inputVariant="outlined"
							required
							name="start_time"
							label="Start Time"
							onChange={checkTimeOrdering}
							value={null}
						/>

						<TimePickerFormsy
							className={formInputClass}
							inputVariant="outlined"
							required
							name="end_time"
							label="End Time"
							onChange={checkTimeOrdering}
							value={null}
						/>
					</div>

					<Typography className="mx-8">
						Dates and times in {timeZone} time
					</Typography>
				</div>

				<div className="flex-1 ml-8">
					<Tabs
						className="w-100"
						value={currentTab}
						onChange={(_, value) => setCurrentTab(value)}
					>
						<Tab label="Audio" />
						<Tab label="Co-organizers" />
						<Tab label="Password" />
					</Tabs>

					<TabPanel index={0} value={currentTab}>
						<RadioGroupFormsy
							name="audio_config"
							value="builtin"
						>
							<FormControlLabel
								label="Use built-in audio"
								value="builtin"
								control={<Radio />}
							/>
							<FormControlLabel
								label="Use my own conference call service"
								value="external"
								control={<Radio />}
							/>
						</RadioGroupFormsy>
					</TabPanel>

					<TabPanel index={1} value={currentTab}>
						<UserSelectFormsy
							name="coorganizers"
							label="Co-organizers"
							multiple
							autoHighlight
							textFieldProps={{
								variant: 'outlined',
							}}
						/>
					</TabPanel>

					<TabPanel index={2} value={currentTab}>
						<Typography>
							Enter an optional password for the meeting.
						</Typography>

						<TextFieldFormsy
							className={formInputClass}
							variant="outlined"
							name="password"
							label="Meeting Password"
						/>
					</TabPanel>
				</div>
			</div>

			<div className="flex justify-end">
				<Button className="m-8" onClick={onCancel}>
					Cancel
				</Button>

				<Button
					className="m-8"
					variant="contained"
					color="primary"
					disabled={!submitEnabled}
					type="submit"
				>
					Save
				</Button>
			</div>
		</Formsy>
	);
}

export default NewMeetingForm;
