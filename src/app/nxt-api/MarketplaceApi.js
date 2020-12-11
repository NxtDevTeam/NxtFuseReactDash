export default class MarketplaceApi {
	/**
	 * Constructs the wrapper from the base backend API wrapper.
	 *
	 * @param {NxtBackendApi} api API wrapper instance (which abstracts the base
	 * URL and authentication).
	 */
	constructor(api) {
		this.api = api;
	}

	getProduct(productId) {
		return this.api.makeRequest({ url: `/products/${productId}` });
	}

	getAllProducts() {
		return this.api.makeRequest({ url: '/products' });
	}

	updateProduct(productId, update) {
		return this.api.makeRequest({
			method: 'put',
			url: `/products/${productId}`,
			data: update,
		});
	}

	createProduct(data) {
		return this.api.makeRequest({
			method: 'post',
			url: '/products',
			data,
		});
	}

	uploadProductImage(productId, file, featured) {
		const formData = new FormData();
		formData.append('image', file, file.name);

		return this.api.makeRequest({
			method: 'post',
			url: `/products/${productId}/images`,
			params: { featured },
			data: formData,
		});
	}

	getProductCategory(categoryId) {
		return this.api.makeRequest({ url: `/product-categories/${categoryId}` });
	}

	getAllProductCategories() {
		return this.api.makeRequest({ url: '/product-categories' });
	}

	updateProductCategory(categoryId, update) {
		return this.api.makeRequest({
			method: 'put',
			url: `/product-categories/${categoryId}`,
			data: update,
		});
	}

	createProductCategory(data) {
		return this.api.makeRequest({
			method: 'post',
			url: '/product-categories',
			data,
		});
	}

	deleteProductCategory(categoryId) {
		return this.api.makeRequest({
			method: 'delete',
			url: `product-categories/${categoryId}`,
		})
	}

	uploadCategoryImage(categoryId, file, featured) {
		const formData = new FormData();
		formData.append('image', file, file.name);

		return this.api.makeRequest({
			method: 'post',
			url: `/product-categories/${categoryId}/images`,
			params: { featured },
			data: formData,
		});
	}

	getOrder(orderId) {
		return this.api.makeRequest({ url: `/orders/${orderId}` });
	}

	getAllOrders() {
		return this.api.makeRequest({ url: '/orders' });
	}

	updateOrder(orderId, update) {
		return this.api.makeRequest({
			method: 'put',
			url: `/orders/${orderId}`,
			data: update,
		});
	}

	createOrder(data) {
		return this.api.makeRequest({
			method: 'post',
			url: '/orders',
			data,
		});
	}

	getUserOrders(userId) {
		return this.api.makeRequest({ url: `/users/${userId}/orders` });
	}
}

const BASE_URL = process.env.REACT_APP_NXT_API_BASE_URL;

export function buildProductImageUrl(productId, imageId, baseUrl = BASE_URL) {
	return new URL(
		`products/${productId}/images/${imageId}`,
		baseUrl,
	).toString();
}
