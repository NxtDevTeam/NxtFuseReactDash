import React from 'react';
import {
	Card,
	CardActionArea,
	CardContent,
	CardHeader,
	CardMedia,
	Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

function CategoryCard({
	className,
	categoryUrl,
	name,
	picture,
	description,
}) {
	return (
		<Card className={clsx(className, 'flex flex-col')}>
			<CardActionArea
				className="flex-1 flex flex-col justify-start items-stretch"
				component={Link}
				to={categoryUrl}
			>
				<CardHeader title={name} />

				<CardMedia
					className="h-136"
					title={name}
					image={picture}
				>
					{picture ? null :
						<Typography align="center">
							Category image not available
						</Typography>}
				</CardMedia>

				<CardContent>
					<Typography>
						{description}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}

export default CategoryCard;
