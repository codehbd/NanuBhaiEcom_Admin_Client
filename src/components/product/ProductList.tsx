"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "../common/ComponentCard";
import Image from "next/image";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";

// Define interfaces
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  previousPrice?: number;
  discountPercentage?: number;
  savedAmount?: number;
  quantity: number;
  stockStatus: string;
  freeDelivery: string;
  categoryId: string;
  imageUrl: string;
  images?: Array<{ id: string; imageUrl: string }>;
  brand?: string;
  sku?: string;
  weight?: string;
  dimensions?: string;
  tags?: string;
  featured?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EditFormState {
  name: string;
  description: string;
  price: string;
  previousPrice: string;
  quantity: string;
  stockStatus: string;
  freeDelivery: string;
  categoryId: string;
  brand: string;
  sku: string;
  weight: string;
  dimensions: string;
  tags: string;
  featured: boolean;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editForm, setEditForm] = useState<EditFormState>({
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
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      // const response = await productService.getProducts();
      // const data = response.data;

      // if (data && data.succeeded && Array.isArray(data.data)) {
      //   setProducts(data.data);
      //   console.log('Products loaded:', data.data);
      // } else {
      //   console.error('Unexpected API response format:', data);
      // }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setEditError(null);

    // Set the edit form with current product data
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      previousPrice: product.previousPrice?.toString() || "",
      quantity: product.quantity.toString(),
      stockStatus: product.stockStatus,
      freeDelivery: product.freeDelivery,
      categoryId: product.categoryId,
      brand: product.brand || "",
      sku: product.sku || "",
      weight: product.weight || "",
      dimensions: product.dimensions || "",
      tags: product.tags || "",
      featured: product.featured || false
    });

    // Set image preview
    if (product.imageUrl) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      setImagePreview(`${backendUrl}${product.imageUrl}`);
    } else {
      setImagePreview("");
    }

    openModal();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Check file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size should be less than 5MB');
        return;
      }

      // Create a new FileReader
      const reader = new FileReader();
      reader.onload = () => {
        // Store the file for form submission
        setSelectedImage(file);

        // Use FileReader result for preview
        const previewUrl = reader.result as string;
        setImagePreview(previewUrl);
      };

      reader.onerror = () => {
        alert('Error reading file');
      };

      // Read the file
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!currentProduct) {
      console.error('No current product selected');
      return;
    }

    try {
      setIsLoading(true);
      setEditError(null);

      const formData = new FormData();

      // Add the required fields for the update API
      formData.append('id', currentProduct.id);
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price', editForm.price);
      formData.append('previousPrice', editForm.previousPrice || '0');
      formData.append('quantity', editForm.quantity || '0');
      formData.append('stockStatus', editForm.stockStatus);
      formData.append('freeDelivery', editForm.freeDelivery);
      formData.append('categoryId', editForm.categoryId);

      // Add optional fields
      if (editForm.brand) formData.append('brand', editForm.brand);
      if (editForm.sku) formData.append('sku', editForm.sku);
      if (editForm.weight) formData.append('weight', editForm.weight);
      if (editForm.dimensions) formData.append('dimensions', editForm.dimensions);
      if (editForm.tags) formData.append('tags', editForm.tags);
      formData.append('featured', editForm.featured.toString());

      // Handle image upload if provided
      if (selectedImage) {
        formData.append('image', selectedImage, 'product-image.jpg');
      }

      console.log('Updating product with data:', {
        id: currentProduct.id,
        name: editForm.name,
        description: editForm.description,
        hasNewImage: !!selectedImage
      });

      // const response = await productService.updateProduct(currentProduct.id, formData);
      // const responseData = response.data;
      // console.log('Update response:', responseData);

      // if (responseData.succeeded) {
      //   // Set success message
      //   setSuccessMessage('Product updated successfully!');

      //   // Auto-hide success message after 3 seconds
      //   setTimeout(() => {
      //     setSuccessMessage(null);
      //   }, 3000);

      //   // Update the products list
      //   await fetchProducts();

      //   // Reset states
      //   setSelectedImage(null);
      //   setImagePreview('');
      //   closeModal();
      // } else {
      //   // Show error message
      //   console.error('API returned failure:', responseData);
      //   const errorMessage = responseData.errors ?
      //     responseData.errors.join(', ') :
      //     responseData.message ?
      //       responseData.message :
      //       'Failed to update product';
      //   setEditError(errorMessage);
      // }
    } catch (error: unknown) {
      const err = error as Error | { response?: { data?: { message?: string }, status?: number }, message?: string };
      console.error('API call failed:', err);
      if (err && typeof err === 'object' && 'response' in err && err.response) {
        console.error('Error response:', err.response.data);
      }
      setEditError(`Failed to update product: ${err && typeof err === 'object' && 'message' in err && err.message ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (productId: string) => {
    setProductToDelete(productId);
    setDeleteError(null);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (!productToDelete) {
      console.error('No product selected for deletion');
      return;
    }

    try {
      setIsDeleting(true);
      console.log(`Deleting product with ID: ${productToDelete}`);

      // const response = await productService.deleteProduct(productToDelete);
      // const responseData = response.data;
      // console.log('Delete response:', responseData);

      // if (responseData.succeeded) {
      //   // Set success message
      //   setSuccessMessage('Product deleted successfully!');

      //   // Auto-hide success message after 3 seconds
      //   setTimeout(() => {
      //     setSuccessMessage(null);
      //   }, 3000);

      //   await fetchProducts();
      //   closeDeleteModal();
      //   setProductToDelete(null);
      // } else {
      //   // Show error message
      //   console.error('API returned failure:', responseData);
      //   const errorMessage = responseData.errors ?
      //     responseData.errors.join(', ') :
      //     responseData.message ?
      //       responseData.message :
      //       'Failed to delete product';
      //   setDeleteError(errorMessage);
      // }
    } catch (err: unknown) {
      const error = err as Error | { response?: { data?: { errors?: string[], message?: string }, status?: number }, message?: string };
      console.error('Error deleting product:', error);
      if (error && typeof error === 'object' && 'response' in error && error.response) {
        console.error('Error response:', error.response.data);
      }
      setDeleteError(`Failed to delete product: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Utility function to get the correct image URL
  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return "/images/product/product-default.png";

    // If the URL already includes http:// or https://, return it as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // Otherwise, prepend the backend URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return `${backendUrl}${imageUrl}`;
  };
  return (
    <>
      <ComponentCard title="Product Management">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-700">
            <div className="text-sm text-green-600 dark:text-green-400">{successMessage}</div>
          </div>
        )}

        {deleteError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-700">
            <div className="text-sm text-red-600 dark:text-red-400">{deleteError}</div>
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400">
                        Loading products...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={`product-${product.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 h-[72px]">
                        <td className="px-5 py-4 sm:px-6 text-start">
                          {product.imageUrl && (
                            <div className="relative h-10 w-10 overflow-hidden rounded-full">
                              <Image
                                width={40}
                                height={40}
                                src={getImageUrl(product.imageUrl)}
                                alt={product.name}
                                priority={true}
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 sm:px-6 text-start">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
                              {product.name}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {product.description.length > 50 
                                ? `${product.description.substring(0, 50)}...` 
                                : product.description
                              }
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 sm:px-6 text-start">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
                              ${product.price}
                            </span>
                            {product.previousPrice && product.previousPrice > product.price && (
                              <span className="block text-gray-500 text-theme-xs line-through">
                                ${product.previousPrice}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 sm:px-6 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
                            {product.quantity}
                          </span>
                        </td>
                        <td className="px-5 py-4 sm:px-6 text-start">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            product.stockStatus === 'inStock' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {product.stockStatus}
                          </span>
                        </td>
                        <td className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-1 text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-1 text-gray-400 hover:text-error-500 dark:hover:text-error-400 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] p-5 lg:p-6">
        <div className="mb-5">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Edit Product
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update product details
          </p>
        </div>

        <form className="space-y-4">
          {/* Product Image */}
          <div>
            <Label>Product Image</Label>
            <div className="mt-2 flex flex-col items-center justify-center gap-3">
              <div className="relative h-32 w-32">
                <Image
                  src={imagePreview || "/images/product/product-default.png"}
                  alt={editForm.name || 'Product image'}
                  fill
                  className="object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
              </div>
              <label className="cursor-pointer px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <span className="text-sm text-gray-600 dark:text-gray-300">Change Image</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Product Name</Label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="w-full h-11 rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>

            <div>
              <Label>Price</Label>
              <input
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                className="w-full h-11 rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label>Previous Price</Label>
              <input
                type="number"
                value={editForm.previousPrice}
                onChange={(e) => setEditForm({...editForm, previousPrice: e.target.value})}
                className="w-full h-11 rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label>Quantity</Label>
              <input
                type="number"
                value={editForm.quantity}
                onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
                className="w-full h-11 rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                min="0"
              />
            </div>

            <div>
              <Label>Stock Status</Label>
              <select
                value={editForm.stockStatus}
                onChange={(e) => setEditForm({...editForm, stockStatus: e.target.value})}
                className="w-full h-11 rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>

            <div>
              <Label>Free Delivery</Label>
              <select
                value={editForm.freeDelivery}
                onChange={(e) => setEditForm({...editForm, freeDelivery: e.target.value})}
                className="w-full h-11 rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => {
                closeModal();
                setEditError(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdate}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : 'Update'}
            </Button>
          </div>

          {editError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg dark:bg-red-900/20 dark:text-red-400">
              {editError}
            </div>
          )}
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        className="max-w-[450px] p-6"
      >
        <div className="text-center">
          <div className="relative flex items-center justify-center z-1 mb-5">
            <svg
              className="fill-error-50 dark:fill-error-500/15"
              width="80"
              height="80"
              viewBox="0 0 90 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M45 0C20.1827 0 0 20.1827 0 45C0 69.8173 20.1827 90 45 90C69.8173 90 90 69.8174 90 45C90.0056 44.6025 90.0056 44.2049 90 43.8074C89.3817 19.4558 69.3842 0.0028 45 0Z"
                fill="inherit"
              />
              <path
                d="M45 20C51.0751 20 56 25.9249 56 32C56 38.0751 51.0751 44 45 44C38.9249 44 34 38.0751 34 32C34 25.9249 38.9249 20 45 20ZM45 48C51.0751 48 56 53.9249 56 60C56 66.0751 51.0751 72 45 72C38.9249 72 34 66.0751 34 60C34 53.9249 38.9249 48 45 48Z"
                fill="currentColor"
              />
            </svg>
            <svg
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fill-error-500"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 0C7.16428 0 0 7.16428 0 16C0 24.8357 7.16428 32 16 32C24.8357 32 32 24.8357 32 16C32.0019 15.841 32.0019 15.682 32 15.5231C31.7526 6.18233 24.8177 -0.752614 15.477 0.000854492C15.318 0.00190381 15.159 0.00190381 15 0.000854492C7.16428 0 0 7.16428 0 16ZM16 24C17.1046 24 18 23.1046 18 22C18 20.8954 17.1046 20 16 20C14.8954 20 14 20.8954 14 22C14 23.1046 14.8954 24 16 24ZM16 18C17.1046 18 18 17.1046 18 16C18 14.8954 17.1046 14 16 14C14.8954 14 14 14.8954 14 16C14 17.1046 14.8954 18 16 18Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            Delete Product
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                closeDeleteModal();
                setDeleteError(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-error-500 hover:bg-error-600 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>

          {deleteError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg dark:bg-red-900/20 dark:text-red-400">
              {deleteError}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
























