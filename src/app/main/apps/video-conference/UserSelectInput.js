import _ from 'lodash';
import React, { useEffect } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectOwnOrgId } from 'app/auth/store/userSlice';
import {
	fetchMemberList,
	selectOrgMembers,
} from 'app/store/organization/membersSlice';
import { withFormsy } from 'formsy-react';

function UserSelectInput({ label, textFieldProps = {}, ...props }) {
	const dispatch = useDispatch();

	const orgId = useSelector(selectOwnOrgId);

	useEffect(() => {
		if (orgId) {
			dispatch(fetchMemberList(orgId));
		}
	}, [orgId, dispatch]);

	const membersData =
		useSelector((state) => selectOrgMembers(state, orgId));

	const loading = membersData ? membersData.loading : false;
	const memberList = membersData?.data ?? [];

	return (
		<Autocomplete
			{...props}
			options={memberList}
			loading={loading}
			getOptionLabel={(option) => option.name}
			renderInput={(renderInputProps) => (
				<TextField
					{...textFieldProps}
					{...renderInputProps}
					label={label}
					inputProps={{
						...renderInputProps.inputProps,
						// To disable internal autocomplete
						autoComplete: 'new-password',
					}}
				/>
			)}
		/>
	);
}

function UserSelectFormWrapper(props) {
	const importedProps = _.pick(props, [
		'label',
		'autoHighlight',
		'autoSelect',
		'multiple',
		'textFieldProps',
	]);

	const { errorMessage } = props;
	const textFieldProps = importedProps.textFieldProps ?? {};
	const value = props.value ?? [];

	function changeValue(event, value) {
		props.setValue(value);
		if (props.onChange) {
			props.onChange(event, value);
		}
	}

	return (
		<UserSelectInput
			{...importedProps}
			value={value}
			onChange={changeValue}
			textFieldProps={{
				...textFieldProps,
				error:
					Boolean((!props.isPristine && props.showRequired) || errorMessage),
				helperText: errorMessage,
			}}
		/>
	);
}

export const UserSelectFormsy = withFormsy(UserSelectFormWrapper);

export default UserSelectInput;
