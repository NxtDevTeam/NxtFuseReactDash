import React from 'react';
import FuseAnimate from '@fuse/core/FuseAnimate';
import { Card, Typography } from '@material-ui/core';

import dashletsConfig from 'app/fuse-configs/dashletsConfig';

function DashletCard({ title, type, options, input, heightClasses }) {
	const dashlet = dashletsConfig[type];

	return (
		<div className="flex-1 min-w-0 p-16 pb-0">
			<Card className="p-16 rounded-8 shadow-1">
				<Typography className="h3" color="textSecondary">
					{title}
				</Typography>

				<div className={heightClasses}>
					{dashlet && input
						? <dashlet.component input={input.data} options={options} />
						: `Unknown dashlet type ${type}`
					}
				</div>
			</Card>
		</div>
	);
}

function DashletRow({ title, dashlets }) {
	// Height of the dashlet is dependant on the number of dashlets in the row
	const dashletCount = dashlets.length;
	const heightClasses = dashletCount <= 2 ? 'h-200 sm:h-256' : 'h-96';

	return (
		<div>
			{title
				?
					<FuseAnimate delay={600}>
						<Typography className="p-16 pb-8 text-18 font-300">
							{title}
						</Typography>
					</FuseAnimate>
				: null
			}

			<div className="flex flex-col sm:flex-row pb-32">
				{dashlets.map((config, index) => (
					<DashletCard key={index} {...config} heightClasses={heightClasses} />
				))}
			</div>
		</div>
	);
}

export default React.memo(DashletRow);
