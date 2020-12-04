import React, { useCallback } from 'react';
import {
	Card,
	CardActionArea,
	CardContent,
	Grid,
	Icon,
	Typography,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getSourceTypeData } from './dataSourceUtils';
import {
	selectSelectedItemId,
	setSelectedItem,
} from './store/dataSourcesSlice';

function DataSourceCard({ selected, id, type, name }) {
	const dispatch = useDispatch();
	const { name: typeName, icon } = getSourceTypeData(type);

	const handleClick = useCallback(
		() => dispatch(setSelectedItem(id)),
		[dispatch, id]);

	return (
		<Card raised={selected}>
			<CardActionArea onClick={handleClick}>
				<CardContent className="flex flex-col items-center">
					<Typography>{typeName}</Typography>
					<Icon className="text-48">{icon}</Icon>
					<Typography variant="caption">{name}</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}

function DataSourceGrid({ dataSources, className }) {
	const selectedItemId = useSelector(selectSelectedItemId);

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
					<DataSourceCard
						selected={id === selectedItemId}
						id={id}
						type={type}
						name={name}
					/>
				</Grid>
			))}
		</Grid>
	);
}

export default React.memo(DataSourceGrid);
