import {
	createSlice,
	createAsyncThunk,
	createEntityAdapter,
	createSelector,
} from '@reduxjs/toolkit';
import auth0Service from 'app/services/auth0Service';
import { NxtCoreApi } from 'app/nxt-api';
import { fetchUser, selectUsersMap } from 'app/store/usersSlice';
import {
	fetchOrganization,
	selectOrganizationsMap,
} from 'app/store/organization/organizationsSlice';
import { getProduct, selectProductsMap } from './productsSlice';

export const getOrderUsers = createAsyncThunk(
	'eCommerceApp/orders/getOrderUsers',
	async (orders, { dispatch }) => {
		if (!Array.isArray(orders)) {
			orders = [orders];
		}

		// Collect unique user IDs referenced
		let userIds = new Set();
		for (let o of orders) {
			userIds.add(o.user_id);
		}

		for (let id of userIds) {
			dispatch(fetchUser(id));
		}
	});

export const getOrderOrganizations = createAsyncThunk(
	'eCommerceApp/orders/getOrderOrganizations',
	async (orders, { dispatch }) => {
		if (!Array.isArray(orders)) {
			orders = [orders];
		}

		// Collect unique IDs referenced
		let orgIds = new Set();
		for (let o of orders) {
			if (o.organization_id) {
				orgIds.add(o.organization_id);
			}
		}

		for (let id of orgIds) {
			dispatch(fetchOrganization(id));
		}
	});

export const getOrderProducts = createAsyncThunk(
	'eCommerceApp/orders/getOrderProducts',
	async (orders, { dispatch }) => {
		if (!Array.isArray(orders)) {
			orders = [orders];
		}

		// Collect unique product IDs referenced
		let productIds = new Set();
		for (let o of orders) {
			for (let item of o.items) {
				productIds.add(item.id);
			}
		}

		for (let id of productIds) {
			dispatch(getProduct(id));
		}
	});

function fetchOrderRefs(
	orders, { fetchUsers, fetchOrganizations, fetchProducts }, dispatch) {
	if (fetchUsers) {
		dispatch(getOrderUsers(orders));
	}

	if (fetchOrganizations) {
		dispatch(getOrderOrganizations(orders));
	}

	if (fetchProducts) {
		dispatch(getOrderProducts(orders));
	}
}

export const getOrders = createAsyncThunk(
	'eCommerceApp/orders/getOrders',
	async ({
		fetchUsers = true,
		fetchOrganizations = true,
		fetchProducts = true,
	} = {}, { dispatch }) => {
		const token = await auth0Service.getNxtBackendToken();
		const api = new NxtCoreApi(token);

		const orders = await api.marketplace.getAllOrders();
		fetchOrderRefs(
			orders, { fetchUsers, fetchOrganizations, fetchProducts }, dispatch);

		return orders;
	});

export const getUserOrders = createAsyncThunk(
	'eCommerceApp/orders/getUserOrders',
	async ({
		userId,
		fetchUsers = true,
		fetchOrganizations = true,
		fetchProducts = true,
	}, { dispatch }) => {
		const token = await auth0Service.getNxtBackendToken();
		const api = new NxtCoreApi(token);
		const orders = await api.marketplace.getUserOrders(userId);
		fetchOrderRefs(
			orders, { fetchUsers, fetchOrganizations, fetchProducts }, dispatch);
		return orders;
	});

export const getOrder = createAsyncThunk(
	'eCommerceApp/order/getOrder',
	async ({
		id,
		fetchUsers = true,
		fetchOrganizations = true,
		fetchProducts = true,
	}, { dispatch }) => {
		const token = await auth0Service.getNxtBackendToken();
		const api = new NxtCoreApi(token);
		const order = await api.marketplace.getOrder(id);
		fetchOrderRefs(
			order, { fetchUsers, fetchOrganizations, fetchProducts }, dispatch);
		return order;
	});

export const createOrder = createAsyncThunk(
	'eCommerceApp/order/saveOrder',
	async (data) => {
		const token = await auth0Service.getNxtBackendToken();
		const api = new NxtCoreApi(token);
		return await api.marketplace.createOrder(data);
	});

export const saveOrder = createAsyncThunk(
	'eCommerceApp/order/saveOrder',
	async ({ id, data }) => {
		const token = await auth0Service.getNxtBackendToken();
		const api = new NxtCoreApi(token);
		return await api.marketplace.updateOrder(id, data);
	});

const ordersAdapter = createEntityAdapter({});

const selectSlice = (state) => state.eCommerceApp.orders;

export const selectSearchText = (state) => selectSlice(state).searchText;
export const selectOrdersLoading = (state) => selectSlice(state).loading;
export const selectOrdersUpdating = (state) => selectSlice(state).updating;

const { selectAll, selectById } = ordersAdapter.getSelectors(selectSlice);

const populateOrder = (order, usersMap, orgsMap, productsMap) => (order && {
	...order,
	user: usersMap[order.user_id]?.data,
	organization: orgsMap[order.organization_id]?.data,
	items: order.items.map((item) => ({
		...item,
		product: productsMap[item.id],
	})),
});

export const selectOrders = createSelector(
	selectAll,
	selectUsersMap,
	selectOrganizationsMap,
	selectProductsMap,
	(orders, usersMap, orgsMap, productsMap) => orders.map((order) =>
		populateOrder(order, usersMap, orgsMap, productsMap))
);

export const selectOrderById = (state, id) => populateOrder(
	selectById(state, id),
	selectUsersMap(state),
	selectOrganizationsMap(state),
	selectProductsMap(state),
);

const ordersSlice = createSlice({
	name: 'eCommerceApp/orders',
	initialState: ordersAdapter.getInitialState({
		searchText: '',
		loading: false,
		updating: false,
	}),
	reducers: {
		setOrdersSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		}
	},
	extraReducers: {
		[getOrders.pending]: (state) => {
			state.loading = true;
		},
		[getOrders.fulfilled]: (state, action) => {
			state.loading = false;
			ordersAdapter.setAll(state, action);
		},
		[getOrders.rejected]: (state) => {
			state.loading = false;
		},

		[getOrder.pending]: (state) => {
			state.loading = true;
		},
		[getOrder.fulfilled]: (state, action) => {
			state.loading = false;
			ordersAdapter.upsertOne(state, action);
		},
		[getOrder.rejected]: (state) => {
			state.loading = false;
		},

		[getUserOrders.pending]: (state) => {
			state.loading = true;
		},
		[getUserOrders.fulfilled]: (state, action) => {
			state.loading = false;
			ordersAdapter.upsertMany(state, action);
		},
		[getUserOrders.rejected]: (state) => {
			state.loading = false;
		},

		[saveOrder.pending]: (state) => {
			state.updating = true;
		},
		[saveOrder.fulfilled]: (state, action) => {
			state.updating = false;
			ordersAdapter.upsertOne(state, action);
		},
		[saveOrder.rejected]: (state) => {
			state.updating = false;
		},
	}
});

export const { setOrdersSearchText } = ordersSlice.actions;

export default ordersSlice.reducer;
