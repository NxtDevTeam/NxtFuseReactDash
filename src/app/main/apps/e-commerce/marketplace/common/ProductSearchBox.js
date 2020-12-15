import React from 'react';
import { Button, Container, InputAdornment, TextField } from '@material-ui/core';
import { Search } from '@material-ui/icons';

function ProductSearchBox({
	className,
	searchText,
	setSearchText,
	onSubmit,
	canSubmit,
}) {
	function handleSubmit(event) {
		event.preventDefault();
		onSubmit && onSubmit();
	}

	return (
		<div className={className}>
			<Container>
				<form onSubmit={handleSubmit}>
					<div className="flex items-center justify-stretch">
						<TextField
							variant="outlined"
							margin="normal"
							className="flex-1"
							id="products-search"
							name="products-search"
							label="Search Products"
							placeholder="Search all products..."
							value={searchText}
							onChange={(event) => setSearchText(event.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Search />
									</InputAdornment>
								)
							}}
						/>

						<Button
							variant="contained"
							className="ml-8"
							type="submit"
							disabled={!canSubmit}
						>
							Search
						</Button>
					</div>
				</form>
			</Container>
		</div>
	);
}

ProductSearchBox.defaultProps = {
	canSubmit: true,
};

export default ProductSearchBox;
