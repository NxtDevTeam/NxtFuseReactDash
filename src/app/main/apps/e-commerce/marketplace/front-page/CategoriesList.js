import React from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import HorizontalList from '../common/HorizontalList';
import CategoryCard from '../common/CategoryCard';

function CategoriesList({ className, title, categories }) {
	return (
		<HorizontalList
			className={className}
			title={title}
		>
			{categories && categories.length > 0
				? categories.map(({
					id,
					name,
					description,
					featured_image_url,
				}) => (
					<CategoryCard
						key={id}
						className="flex-grow-0 flex-shrink-0 w-288 m-16"
						name={name}
						picture={featured_image_url}
						description={description}
						categoryUrl={`/apps/marketplace/category/${id}`}
					/>
					)
				)
				: <FuseLoading />
			}

		</HorizontalList>
	);
}

export default CategoriesList;
