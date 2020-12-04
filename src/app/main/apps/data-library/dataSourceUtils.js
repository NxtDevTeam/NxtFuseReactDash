import byteSize from 'byte-size';

/**
 * Convert a raw number in bytes into a human-fiendly unit representation.
 */
export function byteSizeToString(bytes) {
	return byteSize(bytes).toString();
}

export const dataSourceTypes = {
	'php-sql': {
		name: 'PHP/SQL',
		icon: 'storage',
		options: [
			{
				name: 'url',
				text: 'URL',
				required: true,
			},
			{
				name: 'query',
				text: 'Query',
				required: true,
			}
		],
	},
	'mysql': {
		name: 'MySQL',
		icon: 'storage',
		options: [
			{
				name: 'url',
				text: 'URL',
				required: true,
			},
			{
				name: 'query',
				text: 'Query',
				required: true,
			},
		],
	},
	'mongodb': {
		name: 'MongoDB',
		icon: 'storage',
		options: [
			{
				name: 'url',
				text: 'URL',
				required: true,
			},
			{
				name: 'collection',
				text: 'Collection',
				required: true,
			},
			{
				name: 'query',
				text: 'Query',
				required: true,
			},
		],
	},
	'rest': {
		name: 'REST API',
		icon: 'public',
		options: [
			{
				name: 'url',
				text: 'URL Endpoint',
				required: true,
			},
		],
	},
	'cloud': {
		name: 'Cloud',
		icon: 'cloud',
		options: [
			{
				name: 'url',
				text: 'URL',
				required: true,
			},
			{
				name: 'service',
				text: 'Service',
				required: true,
			},
		],
	},
	'local': {
		name: 'Local',
		icon: 'insert_drive_file',
		options: [
			{
				name: 'file',
				text: 'File Name',
				required: true,
			},
		],
	},
};

const unknownDataSource = {
	name: 'Unknown',
	icon: 'error',
};

/**
 * Return appropriate file icon for a data source type.
 *
 * Uses `'storage'` as a catch-all for unknown/unspecialized types.
 */
export function getSourceTypeData(type) {
	return dataSourceTypes[type] ?? unknownDataSource;
}

export function getRandomDataSourceSize() {
	return 5_000_000_000 / (Math.random() * 100 + 1);
}
