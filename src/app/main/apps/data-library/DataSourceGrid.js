import React from 'react';
import { Card, CardContent, Grid, Icon, Typography } from '@material-ui/core';
import { sourceTypeToIcon } from './dataSourceUtils';

function DataSourceCard({ type, name }) {
	return (
		<Card>
			<CardContent className="flex flex-col items-center">
				<Typography>{type}</Typography>
				<Icon className="text-48">{sourceTypeToIcon(type)}</Icon>
				<Typography variant="caption">{name}</Typography>
			</CardContent>
		</Card>
	);
}

function DataSourceGrid({ dataSources, className }) {
	return (
		<Grid container spacing={1} className={className}>
			{dataSources.map(({ id, type, name }) => (
				<Grid
					item
					key={id}
					xs={6}
					sm={4}
					md={2}
				>
					<DataSourceCard type={type} name={name} />
				</Grid>
			))}
		</Grid>
	);
}

export default React.memo(DataSourceGrid);
