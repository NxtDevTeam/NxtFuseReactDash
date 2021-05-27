import { Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import auth0Service from 'app/services/auth0Service';
import { showMessage } from 'app/store/fuse/messageSlice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';

function Auth0RegisterTab() {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const orgId = queryParams.get('organization_id');
	const orgName = queryParams.get('organization_name');

	const dispatch = useDispatch();

	useEffect(() => {
		if (!orgId) {
			dispatch(showMessage({
				message:
					'New users must register using an organization invitation link.',
				variant: 'error',
			}));
		}
	}, [orgId, dispatch]);

	async function login() {
		await auth0Service.login(orgId);
	}

	const disabled = !orgId;

	return (
		<div className="w-full">
			<Tooltip
				title={disabled ? 'Cannot register without invitation link' : ''}
			>
				<span>
					<Button
						className="w-full my-48"
						color="primary"
						variant="contained"
						disabled={disabled}
						onClick={login}
					>
						{orgName
							? `Register with ${orgName}`
							: 'Register'
						}
					</Button>
				</span>
			</Tooltip>
		</div>
	);
}

export default Auth0RegisterTab;
