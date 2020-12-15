import React, { useMemo, useState } from 'react';
import {
	Container,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from '@material-ui/core';
import FuseLoading from '@fuse/core/FuseLoading';
import ProductCard from './ProductCard';

const sortFunctions = {
	// TODO Use actual creation dates once they are added
	// This bases age off the existing order
	newest: () => 1,
	oldest: () => -1,
	price_high: (a, b) => b.actual_price - a.actual_price,
	price_low: (a, b) => a.actual_price - b.actual_price,
};

function SortableProductList({ className, title, loading, products }) {
	const [sortBy, setSortBy] = useState('newest');

	const sortedProducts = useMemo(() => {
		return products.slice().sort(sortFunctions[sortBy]);
	}, [products, sortBy]);

	return (
		<div className={className}>
			<Container className="flex">
				<Typography variant="h5">{title}</Typography>

				<div className="flex-1 flex justify-end">
					<FormControl variant="outlined">
						<InputLabel>Sort By</InputLabel>
						<Select
							label="Sort By"
							value={sortBy}
							onChange={(event) => setSortBy(event.target.value)}
						>
							<MenuItem value="newest">Newest</MenuItem>
							<MenuItem value="oldest">Oldest</MenuItem>
							<MenuItem value="price_high">Price (Highest - Lowest)</MenuItem>
							<MenuItem value="price_low">Price (Lowest - Highest)</MenuItem>
						</Select>
					</FormControl>
				</div>
			</Container>

			<div className="flex flex-row flex-wrap justify-start items-stretch">
				{(() => {
					if (loading) {
						return <FuseLoading />;
					} else if (sortedProducts.length === 0) {
						return (
							<div className="w-full">
								<Typography variant="h6" align="center">
									Sorry, we didn't find any results matching your search
								</Typography>
							</div>
						);
					} else {
						return sortedProducts.map(({
							id,
							name,
							description,
							featured_image_url,
							price,
							sale_price,
							categories,
						}) => (
								<ProductCard
									key={id}
									className="flex-grow-0 flex-shrink-0 w-288 m-16"
									name={name}
									description={description}
									picture={featured_image_url}
									productUrl={`/apps/marketplace/product/${id}`}
									creatorName={'Nxt AI'}
									price={price}
									salePrice={sale_price}
									categories={categories}
								/>
							)
						);
					}
				})()}
			</div>
		</div>
	);
}

export default SortableProductList;
