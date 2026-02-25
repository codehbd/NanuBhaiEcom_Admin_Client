"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import Form from "../form/Form";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import TextArea from "../form/input/TextArea";
import Radio from "../form/input/Radio";
import { useDropzone } from "react-dropzone";
import Image from "next/image";


// Define interface for category
interface Category {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

// Define interface for product form data
interface ProductFormData {
  name: string;
  description: string;
  price: string;
  previousPrice: string;
  quantity: string;
  stockStatus: string;
  freeDelivery: string;
  categoryId: string;
  brand?: string;
  sku?: string;
  weight?: string;
  dimensions?: string;
  tags?: string;
  featured?: boolean;
  bestSelling?: boolean;
}

export default function AddProduct() {
  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    previousPrice: "",
    quantity: "",
    stockStatus: "inStock",
    freeDelivery: "no",
    categoryId: "",
    brand: "",
    sku: "",
    weight: "",
    dimensions: "",
    tags: "",
    featured: false
  });

  // UI state
  const [productImages, setProductImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setCategoryError(null);

      try {
        // const response = await categoryService.getCategories();
        // console.log('Categories API Response:', response.data);

        // // Check if the response has the expected structure
        // if (response.data && response.data.succeeded && Array.isArray(response.data.data)) {
        //   setCategories(response.data.data);
        // } else {
        //   console.error('Unexpected API response format:', response.data);
        //   setCategoryError('Failed to load categories: Unexpected response format');
        // }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoryError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setProductImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  // Remove image handler
  const removeImage = (indexToRemove: number) => {
    setProductImages(productImages.filter((_, index) => index !== indexToRemove));
  };

  // Convert categories from API to the format expected by the Select component
  const categoryOptions = categories.map(category => ({
    value: category.id.toString(),
    label: category.name
  }));

  // Handle form field changes
  const handleInputChange = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.categoryId) {
        setErrorMessage('Please fill in all required fields (Name, Description, Price, and Category)');
        return;
      }

      // Create FormData for the API request
      const formDataToSend = new FormData();

      // Add basic product information
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('previousPrice', formData.previousPrice || '0');
      formDataToSend.append('quantity', formData.quantity || '0');
      formDataToSend.append('stockStatus', formData.stockStatus);
      formDataToSend.append('freeDelivery', formData.freeDelivery);
      formDataToSend.append('categoryId', formData.categoryId);

      // Add optional fields
      if (formData.brand) formDataToSend.append('brand', formData.brand);
      if (formData.sku) formDataToSend.append('sku', formData.sku);
      if (formData.weight) formDataToSend.append('weight', formData.weight);
      if (formData.dimensions) formDataToSend.append('dimensions', formData.dimensions);
      if (formData.tags) formDataToSend.append('tags', formData.tags);
      formDataToSend.append('featured', (formData.featured || false).toString());
      formDataToSend.append('bestSelling', (formData.bestSelling || false).toString());

      // Add product images
      if (productImages.length > 0) {
        console.log(`Adding ${productImages.length} images to the form data`);

        // Convert base64 images to files
        for (let i = 0; i < productImages.length; i++) {
          try {
            const imageUrl = productImages[i];
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            formDataToSend.append('images', blob, `product-image-${i}.jpg`);
          } catch (imageError) {
            console.error(`Error processing image ${i}:`, imageError);
          }
        }
      }

      console.log("Form data prepared, sending to API...");

      // Send the data to the API
      // const response = await productService.createProduct(formDataToSend);

      // if (response.data && response.data.succeeded) {
      //   console.log("Product created successfully:", response.data);
      //   setSuccessMessage("Product added successfully!");

      //   // Reset form
      //   setFormData({
      //     name: "",
      //     description: "",
      //     price: "",
      //     previousPrice: "",
      //     quantity: "",
      //     stockStatus: "inStock",
      //     freeDelivery: "no",
      //     categoryId: "",
      //     brand: "",
      //     sku: "",
      //     weight: "",
      //     dimensions: "",
      //     tags: "",
      //     featured: false
      //   });
      //   setProductImages([]);

      //   // Auto-hide success message after 3 seconds
      //   setTimeout(() => {
      //     setSuccessMessage(null);
      //   }, 3000);
      // } else {
      //   console.error("API returned error:", response.data);
      //   setErrorMessage(response.data.message || 'Failed to add product');
      // }
    } catch (apiError: unknown) {
      console.error("Error creating product:", apiError);
      if (apiError && typeof apiError === 'object' && 'message' in apiError) {
        setErrorMessage(`Error adding product: ${(apiError as { message: string }).message || 'Unknown error'}`);
      } else {
        setErrorMessage('Error adding product: Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    handleInputChange('categoryId', value);
    
    // Find the selected category object
    const selectedCategoryObj = categories.find(cat => cat.id.toString() === value);
    console.log("Selected category:", value);
    console.log("Selected category name:", selectedCategoryObj?.name);
  };

  return (
    <ComponentCard title="Add New Product">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-700">
          <div className="text-sm text-green-600 dark:text-green-400">{successMessage}</div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-700">
          <div className="text-sm text-red-600 dark:text-red-400">{errorMessage}</div>
        </div>
      )}

      <Form onSubmit={handleSubmit} className="w-full">
        <div className="grid gap-6">
          {/* Dropzone for Images */}
          <div className="col-span-full">
            <Label>Product Media</Label>
            <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
              <div
                {...getRootProps()}
                className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
                  ${isDragActive
                    ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                    : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                  }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  {productImages.length > 0 ? (
                    <div className="w-full">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {productImages.map((image, index) => (
                          <div key={index} className="relative w-full h-32">
                            <Image
                              src={image}
                              alt={`Product ${index + 1}`}
                              fill
                              className="object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                        Drop more images or click to add
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                        <svg
                          className="w-6 h-6 text-gray-700 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                        {isDragActive ? "Drop files here" : "Drag & Drop product images"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Supports: Images (PNG, JPG, WebP)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 border-b pb-2">
                Basic Information
              </h3>

              {/* Product Name */}
              <div>
                <Label htmlFor="productName">Product Name *</Label>
                                  <Input
                    type="text"
                    id="productName"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
              </div>

              {/* Product Category */}
              <div>
                <Label htmlFor="category">Product Category *</Label>
                {isLoadingCategories ? (
                  <div className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 flex items-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                    Loading categories...
                  </div>
                ) : categoryError ? (
                  <div>
                    <div className="h-11 w-full rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 flex items-center text-sm text-red-500 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
                      Failed to load categories
                    </div>
                    <p className="mt-1 text-xs text-red-500">{categoryError}</p>
                  </div>
                ) : (
                  <Select
                    options={categoryOptions}
                    placeholder={categoryOptions.length > 0 ? "Select product category" : "No categories available"}
                    onChange={handleCategoryChange}
                    value={formData.categoryId}
                  />
                )}
              </div>

              {/* Brand */}
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  type="text"
                  id="brand"
                  placeholder="Enter brand name"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                />
              </div>

              {/* SKU */}
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  type="text"
                  id="sku"
                  placeholder="Enter SKU"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                />
              </div>

              {/* Featured Product */}
              <div>
                <Label>Featured Product</Label>
                <div className="flex gap-6">
                  <Radio
                    id="featuredYes"
                    label="Yes"
                    name="featured"
                    value="true"
                    checked={formData.featured === true}
                    onChange={() => handleInputChange('featured', true)}
                  />
                  <Radio
                    id="featuredNo"
                    label="No"
                    name="featured"
                    value="false"
                    checked={formData.featured === false}
                    onChange={() => handleInputChange('featured', false)}
                  />
                </div>
              </div>
              {/* Best Selling Product */}
              <div>
                <Label>Best Selling Product</Label>
                <div className="flex gap-6">
                  <Radio
                    id="bestSellingYes"
                    label="Yes"
                    name="bestSelling"
                    value="true"
                    checked={formData.bestSelling === true}
                    onChange={() => handleInputChange('bestSelling', true)}
                  />
                  <Radio
                    id="bestSellingNo"
                    label="No"
                    name="bestSelling"
                    value="false"
                    checked={formData.bestSelling === false}
                    onChange={() => handleInputChange('bestSelling', false)}
                  />
                </div>
              </div>
            </div>

            {/* Middle Column - Pricing & Stock */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 border-b pb-2">
                Pricing & Stock
              </h3>

              {/* Price */}
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  type="number"
                  id="price"
                  placeholder="Enter product price"
                  min="0"
                  step={0.01}
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                />
              </div>

              {/* Previous Price */}
              <div>
                <Label htmlFor="previousPrice">Previous Price</Label>
                <Input
                  type="number"
                  id="previousPrice"
                  placeholder="Enter previous price (if any)"
                  min="0"
                  step={0.01}
                  value={formData.previousPrice}
                  onChange={(e) => handleInputChange('previousPrice', e.target.value)}
                />
              </div>

              {/* Price Preview Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-blue-200 dark:border-gray-600">
                <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Price Display Preview
                </Label>
                <div className="flex items-center gap-3">
                  {formData.previousPrice && parseFloat(formData.previousPrice) > 0 ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-red-600 dark:text-red-400">
                          ৳{parseFloat(formData.price || 0).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 line-through dark:text-gray-400">
                          ৳{parseFloat(formData.previousPrice || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">
                        {Math.round(((parseFloat(formData.previousPrice) - parseFloat(formData.price)) / parseFloat(formData.previousPrice)) * 100)}% OFF
                      </div>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      ৳{parseFloat(formData.price || 0).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  type="number"
                  id="quantity"
                  placeholder="Enter product quantity"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                />
              </div>

              {/* Stock Status */}
              <div>
                <Label>Stock Status</Label>
                <div className="flex gap-6">
                  <Radio
                    id="inStock"
                    label="In Stock"
                    name="stockStatus"
                    value="inStock"
                    checked={formData.stockStatus === "inStock"}
                    onChange={() => handleInputChange('stockStatus', "inStock")}
                  />
                  <Radio
                    id="outOfStock"
                    label="Out of Stock"
                    name="stockStatus"
                    value="outOfStock"
                    checked={formData.stockStatus === "outOfStock"}
                    onChange={() => handleInputChange('stockStatus', "outOfStock")}
                  />
                </div>
              </div>

              {/* Free Delivery */}
              <div>
                <Label>Free Delivery</Label>
                <div className="flex gap-6">
                  <Radio
                    id="freeDeliveryYes"
                    label="Yes"
                    name="freeDelivery"
                    value="yes"
                    checked={formData.freeDelivery === "yes"}
                    onChange={() => handleInputChange('freeDelivery', "yes")}
                  />
                  <Radio
                    id="freeDeliveryNo"
                    label="No"
                    name="freeDelivery"
                    value="no"
                    checked={formData.freeDelivery === "no"}
                    onChange={() => handleInputChange('freeDelivery', "no")}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 border-b pb-2">
                Additional Information
              </h3>

              {/* Product Description */}
              <div>
                <Label htmlFor="description">Product Description *</Label>
                <TextArea
                  id="description"
                  placeholder="Enter detailed product description"
                  rows={4}
                  value={formData.description}
                  onChange={(value) => handleInputChange('description', value)}
                />
              </div>

              {/* Weight */}
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  type="number"
                  id="weight"
                  placeholder="Enter product weight"
                  min="0"
                                     step={0.01}
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                />
              </div>

              {/* Dimensions */}
              <div>
                <Label htmlFor="dimensions">Dimensions (L x W x H cm)</Label>
                <Input
                  type="text"
                  id="dimensions"
                  placeholder="e.g., 10 x 5 x 2"
                  value={formData.dimensions}
                  onChange={(e) => handleInputChange('dimensions', e.target.value)}
                />
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  type="text"
                  id="tags"
                  placeholder="Enter tags separated by commas"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-colors duration-150 bg-brand-500 border border-transparent rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Product...
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
}
