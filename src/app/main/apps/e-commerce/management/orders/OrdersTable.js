import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';
import _ from '@lodash';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import OrdersStatus from '../order/OrdersStatus';
import {
	selectOrders,
	getOrders,
	selectSearchText,
} from '../../store/ordersSlice';
import OrdersTableHead from './OrdersTableHead';

function OrdersTable(props) {
	const dispatch = useDispatch();
	const orders = useSelector(selectOrders);
	const searchText = useSelector(selectSearchText);

	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(orders);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null
	});

	useEffect(() => {
		dispatch(getOrders({
			fetchUsers: true,
			fetchOrganizations: true,
			// Don't show product information on the table page
			fetchProducts: false,
		}));
	}, [dispatch]);

	useEffect(() => {
		if (searchText.length !== 0) {
			setData(FuseUtils.filterArrayByString(orders, searchText));
			setPage(0);
		} else {
			setData(orders);
		}
	}, [orders, searchText]);

	function handleRequestSort(event, property) {
		const id = property;
		let direction = 'desc';

		if (order.id === property && order.direction === 'desc') {
			direction = 'asc';
		}

		setOrder({
			direction,
			id
		});
	}

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			setSelected(data.map(n => n.id));
			return;
		}
		setSelected([]);
	}

	function handleClick(item) {
		props.history.push(`/apps/e-commerce/orders/${item.id}`);
	}

	function handleCheck(event, id) {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	}

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<OrdersTableHead
						numSelected={selected.length}
						order={order}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data.length}
					/>

					<TableBody>
						{_.orderBy(
							data,
							[
								o => {
									switch (order.id) {
										case 'organization': {
											return o.organization?.name;
										}
										case 'customer': {
											return o.user?.name;
										}
										// case 'payment': {
										// 	return o.payment.method;
										// }
										// case 'status': {
										// 	return o.status[0].name;
										// }
										default: {
											return o[order.id];
										}
									}
								}
							],
							[order.direction]
						)
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map(row => {
								const isSelected = selected.indexOf(row.id) !== -1;
								return (
									<TableRow
										className="h-64 cursor-pointer"
										hover
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={row.id}
										selected={isSelected}
										onClick={event => handleClick(row)}
									>
										<TableCell className="w-40 md:w-64 text-center" padding="none">
											<Checkbox
												checked={isSelected}
												onClick={event => event.stopPropagation()}
												onChange={event => handleCheck(event, row.id)}
											/>
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{row.id}
										</TableCell>

										<TableCell className="p-4 md:p-16 truncate" component="th" scope="row">
											{row.organization ? row.organization.name : ''}
										</TableCell>

										<TableCell className="p-4 md:p-16 truncate" component="th" scope="row">
											{row.user ? row.user.name : ''}
										</TableCell>

										<TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
											<span>$</span>
											{row.total}
										</TableCell>

										{/* <TableCell className="p-4 md:p-16" component="th" scope="row">
											{row.payment.method}
										</TableCell> */}

										{/* <TableCell className="p-4 md:p-16" component="th" scope="row">
											<OrdersStatus name={row.status[0].name} />
										</TableCell> */}

										<TableCell className="p-4 md:p-16" component="th" scope="row">
											{row.date}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</FuseScrollbars>

			<TablePagination
				className="flex-shrink-0 border-t-1"
				component="div"
				count={data.length}
				rowsPerPage={rowsPerPage}
				page={page}
				backIconButtonProps={{
					'aria-label': 'Previous Page'
				}}
				nextIconButtonProps={{
					'aria-label': 'Next Page'
				}}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</div>
	);
}

export default withRouter(OrdersTable);
