import React from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import HorizontalList from '../common/HorizontalList';
import ProductCard from '../common/ProductCard';

function FeaturedProductList({ className, title, products }) {
	return (
		<HorizontalList
			className={className}
			title={title}
		>
			{products && products.length > 0
				? products.map(({
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
				)
				: <FuseLoading />
			}

		</HorizontalList>
	);
}

export default FeaturedProductList;
