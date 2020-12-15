import React from 'react';
import {
	Avatar,
	Badge,
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Icon,
	Tooltip,
	Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

function ProductCard({
	className,
	productUrl,
	name,
	picture,
	description,
	creatorName,
	creatorPicture,
	categories,
	price,
	salePrice,
}) {
	const sale = salePrice != null;
	const shownPrice = sale ? salePrice : price;

	return (
		<Card className={clsx(className, 'flex flex-col')}>
			<CardHeader
				avatar={
					<Avatar alt={creatorName} src={creatorPicture}>
						{creatorName.substring(0, 1)}
					</Avatar>
				}
				title={name}
				titleTypographyProps={{
					component: Link,
					to: productUrl,
				}}
				subheader={creatorName}
			/>

			<CardActionArea
				className="flex-1 flex flex-col justify-start items-stretch"
				component={Link}
				to={productUrl}
			>
				<CardMedia
					className="h-136"
					title={name}
					image={picture}
				>
					{picture ? null :
						<Typography align="center">
							Product image not available
						</Typography>}
				</CardMedia>

				<CardContent>
					<Typography>
						{description}
					</Typography>
				</CardContent>
			</CardActionArea>

			<CardActions disableSpacing>
				<div className="w-full flex flex-row">
					<div className="flex-1 flex flex-row">
						{categories.map(({ id, name, icon }) => (
							<Tooltip key={id} title={name || ''}>
								<Icon>{icon || 'question'}</Icon>
							</Tooltip>
						))}
					</div>

					<Badge
						className="flex-0"
						badgeContent={sale ? 'On Sale' : ''}
						invisible={!sale}
						color="primary"
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
					>
						<Button
							variant="contained"
							color="secondary"
							component={Link}
							to={productUrl}
						>
							{`$${shownPrice}`}
						</Button>
					</Badge>
				</div>
			</CardActions>
		</Card>
	);
}

export default ProductCard;
