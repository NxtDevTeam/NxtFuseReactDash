import React, { useState } from 'react';
import ProductSearchBox from '../common/ProductSearchBox';

function ProductSearchHeader({ initialSearchText, onSubmit }) {
	const [searchText, setSearchText] = useState(initialSearchText);

	const canSubmit = !!searchText && searchText !== initialSearchText;

	return (
		<ProductSearchBox
			className="w-full"
			searchText={searchText}
			setSearchText={setSearchText}
			onSubmit={() => onSubmit(searchText)}
			canSubmit={canSubmit}
		/>
	);
}

export default ProductSearchHeader;
