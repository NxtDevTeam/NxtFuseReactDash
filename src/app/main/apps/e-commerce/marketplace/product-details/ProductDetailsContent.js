import React from 'react';
import { Button, Typography } from '@material-ui/core';
import Carousel from 'react-material-ui-carousel';

function ProductDetailsContent({ product, onAddToCart }) {
	const images = product.image_urls;
	const featuredIndex = images.indexOf(product.featured_image_url);

	return (
		<div className="flex items-start">
			<Carousel
				className="flex-1"
				autoPlay={false}
				animation="slide"
				index={featuredIndex}
			>
				{images.map((img) => (
					<div key={img} className="w-full">
						<img className="m-auto" alt={product.name} src={img} />
					</div>
				))}
			</Carousel>

			<div className="flex-1 ml-32">
				<Typography variant="h5" paragraph>{product.name}</Typography>

				{product.on_sale
					? (
						<div>
							<Typography
								variant="h6"
								color="error"
								component="span"
							>
								{product.sale_price}
							</Typography>

							<Typography
								variant="h6"
								className="line-through"
								component="span"
							>
								{product.price}
							</Typography>
						</div>
					)
					: <Typography variant="h6">{product.price}</Typography>
				}

				<Button
					variant="contained"
					color="secondary"
					className="my-16"
					onClick={onAddToCart}
				>
					Add to Cart
				</Button>

				<Typography variant="h6" paragraph>Description</Typography>
				<Typography>{product.description}</Typography>
			</div>
		</div>
	);
}

export default ProductDetailsContent;
