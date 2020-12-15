import React from 'react';
import { Typography } from '@material-ui/core';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import clsx from 'clsx';

function HorizontalList({ className, title, children }) {
	return (
		<div className={clsx(className, "p-32")}>
			<Typography variant="h5">{title}</Typography>

			<FuseScrollbars className="overflow-x-auto flex">
				{children}
			</FuseScrollbars>
		</div>
	);
}

export default HorizontalList;
