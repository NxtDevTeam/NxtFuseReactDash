import React from 'react';
import { Container } from '@material-ui/core';
import Carousel from 'react-material-ui-carousel';

function MarketplaceBanner({ images }) {
	return (
		<Container>
			<Carousel
				interval={8000}
				animation="slide"
				timeout={600}
				navButtonsAlwaysVisible
				indicators={false}
			>
				{images.map(({ id, description, src }) => (
					<div key={id} className="flex justify-center">
						<img alt={description} src={src} />
					</div>
				))}
			</Carousel>
		</Container>
	);
}

export default MarketplaceBanner;
