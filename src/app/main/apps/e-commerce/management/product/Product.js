import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useForm } from '@fuse/hooks';
import _ from '@lodash';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { buildProductImageUrl } from 'app/nxt-api/MarketplaceApi';
import {
	saveProduct,
	getProduct,
	createProduct,
	selectProductById,
	selectProductsLoading,
	selectProductUpdating,
} from '../../store/productsSlice';
import {
	getAllProductCategories,
	selectCategoriesMap,
	selectCategoriesLoading,
} from '../../store/productCategoriesSlice';
import reducer from '../../store';
import ProductImage from './ProductImage';
import FuseUtils from '@fuse/utils';

const useStyles = makeStyles((theme) => ({
	productImageUpload: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
}));

function Product(props) {
	const dispatch = useDispatch();
	const theme = useTheme();
	const classes = useStyles();

	const [tabValue, setTabValue] = useState(0);
	const { form, handleChange, setForm, setInForm } = useForm(null);
	const { productId } = useParams();
	const newProduct = productId === 'new';
	const product = useSelector((state) => selectProductById(state, productId));
	const productLoading = useSelector(selectProductsLoading);
	const productUpdating = useSelector(selectProductUpdating);
	const productCategoriesLoading = useSelector(selectCategoriesLoading);

	useEffect(() => {
		if (newProduct) {
			setForm({
				sku: '',
				name: '',
				description: '',
				categories: [],
				tags: [],
				price: 0,
				sale_price: 0,
				images: [],
				imagesToUpload: [],
			});
		} else {
			dispatch(getProduct(productId));
		}
	}, [productId, newProduct, setForm, dispatch]);

	useEffect(() => {
		if ((product && !form) || (product && form && product.id !== form.id)) {
			setForm({
				...product,
				categories: product.categories.map(({ id, name }) => ({
					value: id,
					label: name,
				})),
				imagesToUpload: [],
			});
		}
	}, [form, product, setForm]);

	useEffect(() => {
		dispatch(getAllProductCategories());
	}, [dispatch]);

	const productCategoriesMap = useSelector(selectCategoriesMap);
	// List of { value, label }, sorted by label
	const productCategoryOptions = useMemo(() => {
		const options = Object.values(productCategoriesMap)
			.map((cat) => ({ value: cat.id, label: cat.name ?? '...' }));
		return options.sort((a, b) => a.label.localeCompare(b.label));
	}, [productCategoriesMap]);

	const featuredImageId = form?.featured_image;
	const existingImages = product?.images;
	const imagesToUpload = form?.imagesToUpload;
	const featuredImageUrl = useMemo(() => {
		// Look in both already-uploaded images and pending ones
		if (existingImages && existingImages.includes(featuredImageId)) {
			return buildProductImageUrl(productId, featuredImageId);
		} else if (imagesToUpload) {
			const pendingFeaturedImage = imagesToUpload.find(
				({ featured }) => featured);
			return pendingFeaturedImage?.url;
		}
	}, [featuredImageId, existingImages, imagesToUpload, productId]);

	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	function handleChipChange(value, name) {
		setInForm(
			name,
			value.map(item => item.value)
		);
	}

	// Set an already-uploaded image as featured
	function setFeaturedImage(id) {
		setInForm('featured_image', id);
	}

	// Set one of the newly-uploaded images as featured
	function setFeaturedImageUploaded(id) {
		// This field is for already-uploaded images
		setForm({
			...form,
			featured_image: undefined,
			imagesToUpload: form.imagesToUpload.map((image) => ({
				...image,
				featured: image.id === id,
			})),
		});
	}

	function handleUploadChange(e) {
		const file = e.target.files[0];
		if (!file) {
			return;
		}

		setInForm('imagesToUpload', [
			...form.imagesToUpload,
			{
				// ID used to reference the image locally since File objects do not
				// have any good, unique identifiers
				id: FuseUtils.generateGUID(),
				file,
				// URL for displaying images not yet uploaded
				url: URL.createObjectURL(file),
			},
		]);
	}

	function handleChangeAvailability(e) {
		setInForm('available', e.target.checked);
	}

	function canBeSubmitted() {
		return (
			!productUpdating
			&& form.name.length > 0
			&& !_.isEqual(product, form)
		);
	}

	function handleSave() {
		if (newProduct) {
			dispatch(createProduct({
				data: {
					..._.pick(form, [
						'sku',
						'name',
						'description',
						'tags',
						'price',
						'sale_price',
						'available',
						'featured_image',
					]),
					categories: form.categories.map(({ value }) => value),
				},
				imagesToUpload: form.imagesToUpload,
			}));
		} else {
			dispatch(saveProduct({
				id: productId,
				data: {
					..._.pick(form, [
						'name',
						'description',
						'tags',
						'price',
						'sale_price',
						'available',
						'featured_image',
					]),
					categories: form.categories.map(({ value }) => value),
				},
				imagesToUpload: form.imagesToUpload,
			}));
		}
	}

	if (productLoading || productCategoriesLoading) {
		return <FuseLoading />;
	}

	return (
		<FusePageCarded
			classes={{
				toolbar: 'p-0',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={
				form && (
					<div className="flex flex-1 w-full items-center justify-between">
						<div className="flex flex-col items-start max-w-full">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Typography
									className="normal-case flex items-center sm:mb-12"
									component={Link}
									role="button"
									to="/apps/e-commerce/products"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Products</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<FuseAnimate animation="transition.expandIn" delay={300}>
									{featuredImageUrl ? (
										<img
											className="w-32 sm:w-48 rounded"
											src={featuredImageUrl}
											alt={form.name}
										/>
									) : (
											<img
												className="w-32 sm:w-48 rounded"
												src="assets/images/ecommerce/product-image-placeholder.png"
												alt={form.name}
											/>
										)}
								</FuseAnimate>
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.name ? form.name : 'New Product'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Product Detail</Typography>
									</FuseAnimate>
								</div>
							</div>
						</div>
						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Button
								className="whitespace-no-wrap normal-case"
								variant="contained"
								color="secondary"
								disabled={!canBeSubmitted()}
								onClick={handleSave}
							>
								{newProduct ? 'New' : 'Save'}
							</Button>
						</FuseAnimate>
					</div>
				)
			}
			contentToolbar={
				<Tabs
					value={tabValue}
					onChange={handleChangeTab}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="auto"
					classes={{ root: 'w-full h-64' }}
				>
					<Tab className="h-64 normal-case" label="Basic Info" />
					<Tab className="h-64 normal-case" label="Product Images" />
					<Tab className="h-64 normal-case" label="Pricing" />
					<Tab className="h-64 normal-case" label="Inventory" />
					<Tab className="h-64 normal-case" label="Shipping" />
				</Tabs>
			}
			content={
				form && (
					<div className="p-16 sm:p-24 max-w-2xl">
						{tabValue === 0 && (
							<div>
								<TextField
									className="mt-8 mb-16"
									error={form.name === ''}
									required
									label="Name"
									autoFocus
									id="name"
									name="name"
									value={form.name}
									onChange={handleChange}
									variant="outlined"
									fullWidth
								/>

								<TextField
									className="mt-8 mb-16"
									id="description"
									name="description"
									onChange={handleChange}
									label="Description"
									type="text"
									value={form.description}
									multiline
									rows={5}
									variant="outlined"
									fullWidth
								/>

								<FuseChipSelect
									className="mt-8 mb-24"
									value={form.categories}
									onChange={value => setInForm('categories', value)}
									placeholder="Select multiple categories"
									textFieldProps={{
										label: 'Categories',
										InputLabelProps: {
											shrink: true
										},
										variant: 'outlined'
									}}
									isMulti
									fixed
									options={productCategoryOptions}
								/>

								<FuseChipSelect
									className="mt-8 mb-16"
									value={form.tags.map(item => ({
										value: item,
										label: item
									}))}
									onChange={value => handleChipChange(value, 'tags')}
									placeholder="Select multiple tags"
									textFieldProps={{
										label: 'Tags',
										InputLabelProps: {
											shrink: true
										},
										variant: 'outlined'
									}}
									isMulti
								/>
							</div>
						)}
						{tabValue === 1 && (
							<div>
								<div className="flex justify-center sm:justify-start flex-wrap -mx-8">
									<label
										htmlFor="button-file"
										className={clsx(
											classes.productImageUpload,
											'flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5'
										)}
									>
										<input
											accept="image/*"
											className="hidden"
											id="button-file"
											type="file"
											onChange={handleUploadChange}
										/>
										<Icon fontSize="large" color="action">
											cloud_upload
										</Icon>
									</label>
									{form.images.map((imageId) => (
										<ProductImage
											key={imageId}
											src={buildProductImageUrl(productId, imageId)}
											featured={form.featured_image === imageId}
											onClick={() => setFeaturedImage(imageId)}
										/>
									))}
									{form.imagesToUpload.map(({ id, url, featured }) => (
										<ProductImage
											key={id}
											src={url}
											featured={featured}
											onClick={() => setFeaturedImageUploaded(id)}
										/>
									))}
								</div>
							</div>
						)}
						{tabValue === 2 && (
							<div>
								<TextField
									className="mt-8 mb-16"
									label="Base Price"
									id="price"
									name="price"
									value={form.price}
									onChange={handleChange}
									InputProps={{
										startAdornment:
											<InputAdornment position="start">$</InputAdornment>
									}}
									type="number"
									variant="outlined"
									autoFocus
									fullWidth
								/>

								<TextField
									className="mt-8 mb-16"
									label="Sale Price"
									id="sale_price"
									name="sale_price"
									value={form.sale_price}
									onChange={handleChange}
									InputProps={{
										startAdornment:
											<InputAdornment position="start">$</InputAdornment>
									}}
									type="number"
									variant="outlined"
									fullWidth
								/>

								<TextField
									className="mt-8 mb-16"
									label="Tax Rate"
									id="tax_rate"
									name="tax_rate"
									value={form.tax_rate}
									onChange={handleChange}
									InputProps={{
										startAdornment:
											<InputAdornment position="start">%</InputAdornment>
									}}
									type="number"
									variant="outlined"
									fullWidth
								/>
							</div>
						)}
						{tabValue === 3 && (
							<div>
								<TextField
									className="mt-8 mb-16"
									required
									label="SKU"
									disabled={!newProduct}
									autoFocus={newProduct}
									id="sku"
									name="sku"
									value={form.sku}
									onChange={handleChange}
									variant="outlined"
									fullWidth
								/>

								<FormControlLabel
									control={
										<Checkbox
											className="mt-8 mb-16"
											id="available"
											name="available"
											checked={form.available}
											onChange={handleChangeAvailability}
										/>
									}
									label="Available"
								/>
							</div>
						)}
						{tabValue === 4 && (
							<div>
								<div className="flex -mx-4">
									<TextField
										className="mt-8 mb-16 mx-4"
										label="Width"
										autoFocus
										id="width"
										name="width"
										value={form.width}
										onChange={handleChange}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className="mt-8 mb-16 mx-4"
										label="Height"
										id="height"
										name="height"
										value={form.height}
										onChange={handleChange}
										variant="outlined"
										fullWidth
									/>

									<TextField
										className="mt-8 mb-16 mx-4"
										label="Depth"
										id="depth"
										name="depth"
										value={form.depth}
										onChange={handleChange}
										variant="outlined"
										fullWidth
									/>
								</div>

								<TextField
									className="mt-8 mb-16"
									label="Weight"
									id="weight"
									name="weight"
									value={form.weight}
									onChange={handleChange}
									variant="outlined"
									fullWidth
								/>

								<TextField
									className="mt-8 mb-16"
									label="Extra Shipping Fee"
									id="extraShippingFee"
									name="extraShippingFee"
									value={form.extraShippingFee}
									onChange={handleChange}
									variant="outlined"
									InputProps={{
										startAdornment: <InputAdornment position="start">$</InputAdornment>
									}}
									fullWidth
								/>
							</div>
						)}
					</div>
				)
			}
			innerScroll
		/>
	);
}

export default withReducer('eCommerceApp', reducer)(Product);
