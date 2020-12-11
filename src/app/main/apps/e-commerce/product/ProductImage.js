import React from 'react';
import { makeStyles, Icon } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
	productImageFeaturedStar: {
		position: 'absolute',
		top: 0,
		right: 0,
		color: orange[400],
		opacity: 0
	},
	productImageUpload: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
	productImageItem: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& $productImageFeaturedStar': {
				opacity: 0.8
			}
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& $productImageFeaturedStar': {
				opacity: 1
			},
			'&:hover $productImageFeaturedStar': {
				opacity: 1
			}
		}
	}
}));

function ProductImage({ src, featured, onClick }) {
	const classes = useStyles();

	return (
		<div
			onClick={onClick}
			onKeyDown={onClick}
			role="button"
			tabIndex={0}
			className={clsx(
				classes.productImageItem,
				'flex items-center justify-center relative',
				'w-128 h-128 rounded-8 mx-8 mb-16',
				'overflow-hidden cursor-pointer',
				'shadow-1 hover:shadow-5',
				featured ? 'featured' : null,
			)}
		>
			<Icon className={classes.productImageFeaturedStar}>star</Icon>
			<img className="max-w-none w-auto h-full" src={src} alt="product" />
		</div>
	);
}

export default ProductImage;
