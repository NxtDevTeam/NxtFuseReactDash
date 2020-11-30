import byteSize from 'byte-size';

/**
 * Convert a raw number in bytes into a human-fiendly unit representation.
 */
export function byteSizeToString(bytes) {
	return byteSize(bytes).toString();
}

const sourceTypeIcons = {
	'REST API': 'public',
	'Cloud': 'cloud',
	'Local': 'insert_drive_file',
};

/**
 * Return appropriate file icon for a data source type.
 *
 * Uses `'storage'` as a catch-all for unknown/unspecialized types.
 */
export function sourceTypeToIcon(type) {
	if (type in sourceTypeIcons) {
		return sourceTypeIcons[type];
	} else {
		return 'storage';
	}
}
