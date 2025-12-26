"use client";
import { useModal } from "@/hooks/useModal";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import ComponentCard from "../common/ComponentCard";
import EditCategorySelect from "../form/EditCategorySelect";
import Form from "../form/Form";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

interface Category {
  id: string;
  _id?: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  parentId?: string | null;
  status?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SubCategory {
  id: string;
  _id?: string;
  name: string;
  description: string;
  imageUrl: string | null;
  parentId: string; // This will be the category ID
  categoryName?: string;
  status?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EditFormState {
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  imageUrl: string | null;
  // For backward compatibility with existing code
  subCategory?: string;
  image?: string | null;
}

export default function Categories() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{value: string, label: string}[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  // We'll use this in a real app when calling the API
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [subCategoryImage, setSubCategoryImage] = useState<string | null>(null);
  const [subCategoryImagePreview, setSubCategoryImagePreview] = useState<string | null>(null);
  const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory | null>(null);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    categoryId: "",
    categoryName: "",
    name: "",
    description: "",
    imageUrl: null
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();

  // Fetch categories and subcategories from API
  useEffect(() => {
    testServerConnection();
    fetchCategories();
    fetchSubCategories();
  }, []);

  const testServerConnection = async () => {
    try {
      // const isConnected = await subCategoryService.testServerConnectivity();
      
      // if (isConnected) {
      //   console.log('✅ Server connection test passed');
      //   setDeleteError(null);
      // } else {
      //   console.error('❌ Server connection test failed');
      //   setDeleteError('Cannot connect to subcategories API. Please check your backend server.');
      // }
    } catch (error) {
      console.error('Error testing server connection:', error);
      setDeleteError('Error testing server connection. Check console for details.');
    }
  };

  // Log editForm changes
  useEffect(() => {
    console.log('EditForm state changed:', editForm);
    console.log('CategoryId in editForm:', editForm.categoryId);
  }, [editForm]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      // const response = await subCategoryService.getParentCategories();

      // if (response.data && response.data.succeeded) {
      //   const categoriesData = response.data.data as Category[];

      //   // Log the raw categories data
      //   console.log('Raw parent categories data:', categoriesData);

      //   // Ensure all category IDs are strings
      //   const processedCategories = categoriesData.map(category => ({
      //     ...category,
      //     id: category.id?.toString() || ''
      //   }));

      //   setCategories(processedCategories);
      //   console.log('Processed parent categories:', processedCategories);

      //   // Create options for the select dropdown
      //   const options = processedCategories.map(category => ({
      //     value: category.id,
      //     label: category.name
      //   }));
      //   console.log('Parent category options for dropdown:', options);
      //   setCategoryOptions(options);
        
      //   // Debug: Log the current state
      //   console.log('Current selectedCategoryId:', selectedCategoryId);
      //   console.log('Current categoryOptions length:', options.length);
      // } else {
      //   console.error("Failed to fetch parent categories:", response.data);
      //   setDeleteError('Failed to fetch parent categories');
      // }
    } catch (err) {
      console.error('Error fetching parent categories:', err);
      setDeleteError('Failed to fetch parent categories');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      setIsLoading(true);
      // const response = await subCategoryService.getSubCategories();

      // if (response.data && response.data.succeeded) {
      //   const subCategoriesData = response.data.data as SubCategory[];

      //   // The backend already provides categoryName, so we don't need to fetch it separately
      //   setSubCategories(subCategoriesData);
      //   console.log('Subcategories loaded:', subCategoriesData);
      // } else {
      //   setDeleteError('Failed to fetch subcategories');
      // }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setDeleteError('Failed to fetch subcategories');
    } finally {
      setIsLoading(false);
    }
  };

  // We now handle this in the fetchCategories function
  // const categoryOptions = categories.map(category => ({
  //   value: category.id.toString(),
  //   label: category.name
  // }));

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      console.log('Dropped file:', file.name, file.size, file.type);

      // Create a preview URL for display - this matches the ProductCategories approach
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setSubCategoryImage(result);
        setSubCategoryImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if (selectedCategoryId && subCategory.trim()) {
      // Find the selected category name
      const category = categories.find(cat => cat.id === selectedCategoryId);
      if (!category) return;

      try {
        setIsLoading(true);

        // Create form data for API call
        const formData = new FormData();
        formData.append('parentId', selectedCategoryId); // Use parentId for subcategories
        formData.append('name', subCategory.trim());
        formData.append('description', description.trim());
        if (subCategoryImage) {
          try {
            // This matches exactly how ProductCategories handles the image
            const base64Response = await fetch(subCategoryImage);
            const blob = await base64Response.blob();
            formData.append('image', blob, 'subcategory-image.jpg');

            // Log what we're sending
            console.log('Appending image blob to FormData as \'image\'');
          } catch (error) {
            console.error('Error processing image:', error);
          }
        }

        // Log the complete FormData
        console.log('Complete FormData:');
        for (const pair of formData.entries()) {
          if (pair[0] === 'ImageFile') {
            console.log(pair[0], 'File object:', pair[1]);
            const file = pair[1] as File;
            console.log('File name:', file.name);
            console.log('File size:', file.size);
            console.log('File type:', file.type);
          } else {
            console.log(pair[0], pair[1]);
          }
        }

        // Call the API using the service
        console.log('Sending API request to create subcategory...');
        // const response = await subCategoryService.createSubCategory(formData);
        // console.log('API request completed');

        // // Log the response
        // console.log('API Response:', response.data);

        // if (response.data && response.data.succeeded) {
        //   // Set success message
        //   setSuccessMessage('Subcategory created successfully!');

        //   // Auto-hide success message after 3 seconds
        //   setTimeout(() => {
        //     setSuccessMessage(null);
        //   }, 3000);

        //   // Refresh the subcategories list
        //   await fetchSubCategories();

        //   // Reset all form fields
        //   setSelectedCategoryId("");
        //   setSubCategory("");
        //   setDescription("");
        //   setSubCategoryImage(null);
        //   setSubCategoryImagePreview(null);
        //   form.reset(); // Reset the native form
        // } else {
        //   const errorMessage = response.data.errors ? response.data.errors.join(', ') : 'Failed to create subcategory';
        //   setDeleteError(errorMessage);
        // }
      } catch (err) {
        console.error('Error creating subcategory:', err);
        setDeleteError('Failed to create subcategory');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (subCategory: SubCategory) => {
    // Clear any previous error
    setEditError(null);

    // Store the current subcategory for API calls
    setCurrentSubCategory(subCategory);

    // Process the image URL to ensure it's a string
    let safeImageUrl = "";

    if (subCategory.imageUrl) {
      // If we have an image URL from the API, use it with the correct backend URL
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      safeImageUrl = `${backendUrl}${subCategory.imageUrl}`;
    }

    console.log('Editing subcategory with image:', safeImageUrl);

    // Log the subcategory data to verify the parentId
    console.log('Editing subcategory:', {
      id: subCategory.id,
      name: subCategory.name,
      parentId: subCategory.parentId,
      categoryName: subCategory.categoryName
    });

    // Ensure parentId is a string
    const categoryId = typeof subCategory.parentId === 'string' ? subCategory.parentId : (subCategory.parentId ? String(subCategory.parentId) : "");

    console.log('Original subcategory:', subCategory);
    console.log('ParentId from API:', subCategory.parentId, 'type:', typeof subCategory.parentId);
    console.log('Using categoryId:', categoryId, 'type:', typeof categoryId);

    // Create the edit form object
    const newEditForm = {
      categoryId: categoryId, // always string
      categoryName: subCategory.categoryName || 'Unknown Category',
      name: subCategory.name,
      description: subCategory.description || '',
      imageUrl: safeImageUrl,
      // For backward compatibility
      subCategory: subCategory.name,
      image: safeImageUrl
    };

    // Set the edit form
    setEditForm(newEditForm);

    // Force a refresh of the category select by setting a timeout
    setTimeout(() => {
      console.log('Refreshing category select with categoryId:', categoryId);
      // This is a hack to force the select to update
      setEditForm(prev => ({ ...prev }));
    }, 100);

    // Log the edit form to verify the categoryId was set correctly
    console.log('Edit form initialized with:', newEditForm);
    console.log('CategoryId type:', typeof categoryId);
    console.log('CategoryId value:', categoryId);

    setImagePreview(safeImageUrl);
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
        setEditForm({ ...editForm, imageUrl: previewUrl, image: previewUrl });
      };

      reader.onerror = () => {
        alert('Error reading file');
      };

      // Read the file
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!currentSubCategory) {
      console.error('No current subcategory selected');
      return;
    }

    try {
      setIsLoading(true);
      setEditError(null);

      const formData = new FormData();

      // Add the required fields for the update API
      formData.append('id', currentSubCategory.id.toString());

      // Log the categoryId to verify it's correct
      console.log('Updating subcategory with categoryId:', editForm.categoryId);

      // Make sure categoryId is a string
      const categoryIdStr = editForm.categoryId || "";

      // Add all required fields with EXACT case matching what the API expects
      formData.append('parentId', categoryIdStr); // Use parentId for subcategories
      formData.append('name', editForm.name || '');
      formData.append('description', editForm.description || '');

      // Log the categoryId we're sending
      console.log('CategoryId being sent:', categoryIdStr, 'type:', typeof categoryIdStr);
      console.log('CategoryId parsed as number:', parseInt(categoryIdStr));

      // Handle the image URL
      // If we have a new image selected, append it
      if (selectedImage) {
        formData.append('image', selectedImage, 'subcategory-image.jpg');
        console.log('Appending new image to form data');
      }
      // If we're using an existing image URL, append it as a string
      else if (currentSubCategory.imageUrl) {
        // Just pass the relative path without the base URL
        const imageUrlPath = currentSubCategory.imageUrl;
        formData.append('ImageUrl', imageUrlPath);
        console.log('Using existing image URL:', imageUrlPath);
      }

      // Log all form data to verify
      console.log('All form data fields:');
      for (const pair of formData.entries()) {
        console.log(`- ${pair[0]}: ${pair[1]}`);
      }

      console.log('Updating subcategory with data:', {
        id: currentSubCategory.id,
        categoryId: categoryIdStr,
        name: editForm.name,
        description: editForm.description,
        hasNewImage: !!selectedImage
      });

      // Log the form data entries before sending
      console.log('FormData entries:');
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      console.log('Sending update request to API...');

      // Make sure categoryId is a number and not a string
      const categoryIdNum = parseInt(categoryIdStr);

      if (isNaN(categoryIdNum)) {
        console.error('Invalid categoryId:', categoryIdStr);
        setEditError(`Invalid category ID: ${categoryIdStr}`);
        return;
      }

      // Check if the category exists in our local state
      const categoryExists = categories.some(cat => cat.id === categoryIdStr);
      if (!categoryExists) {
        console.warn(`Category with ID ${categoryIdStr} not found in available categories!`);
        setEditError(`Category with ID ${categoryIdStr} not found. Please select a valid category.`);
        return;
      }

      console.log(`Category with ID ${categoryIdStr} found in available categories.`);

      try {
        // const response = await subCategoryService.updateSubCategory(currentSubCategory.id, formData);
        // const responseData = response.data;
        // console.log('Update response:', responseData);

        // if (responseData && responseData.succeeded) {
        //   // Set success message
        //   setSuccessMessage('Subcategory updated successfully!');

        //   // Auto-hide success message after 3 seconds
        //   setTimeout(() => {
        //     setSuccessMessage(null);
        //   }, 3000);

        //   await fetchSubCategories();
        //   closeModal();
        // } else {
        //   // Show error message
        //   console.error('API returned failure:', responseData);
        //   const errorMessage = responseData.errors ?
        //     responseData.errors.join(', ') :
        //     responseData.message ?
        //       responseData.message :
        //       'Failed to update subcategory';
        //   setEditError(errorMessage);
        // }
      } catch (error: unknown) {
        const err = error as Error | { response?: { data?: { message?: string }, status?: number }, message?: string };
        console.error('API call failed:', err);
        if (err && typeof err === 'object' && 'response' in err && err.response) {
          console.error('Error response:', err.response.data);
        }
        setEditError(`Failed to update subcategory: ${err && typeof err === 'object' && 'message' in err && err.message ? err.message : 'Unknown error'}`);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const resp = (err as { response?: { data?: unknown } }).response;
        console.error('Error response:', resp?.data);
      }
      if (err && typeof err === 'object' && 'message' in err) {
        setEditError(`Failed to update subcategory: ${(err as { message?: string }).message || 'Unknown error'}`);
      } else {
        setEditError('Failed to update subcategory: Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    console.log("Deleting sub-category:", id);

    // Clear any previous error
    setDeleteError(null);

    // Set the subcategory ID to delete and open the confirmation modal
    setSubCategoryToDelete(id);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (!subCategoryToDelete) {
      console.error('No subcategory selected for deletion');
      return;
    }

    try {
      setIsDeleting(true);
      console.log(`Deleting subcategory with ID: ${subCategoryToDelete}`);

      // const response = await subCategoryService.deleteSubCategory(subCategoryToDelete);
      // console.log('Delete response:', response.data);

      // if (response.data && response.data.succeeded) {
      //   // Set success message
      //   setSuccessMessage('Subcategory deleted successfully!');

      //   // Auto-hide success message after 3 seconds
      //   setTimeout(() => {
      //     setSuccessMessage(null);
      //   }, 3000);

      //   await fetchSubCategories();
      //   closeDeleteModal();
      //   setSubCategoryToDelete(null);
      // } else {
      //   // Show error message
      //   console.error('API returned failure:', response.data);
      //   const errorMessage = response.data && response.data.errors ?
      //     response.data.errors.join(', ') :
      //     (response.data && response.data.message) ?
      //       response.data.message :
      //       'Failed to delete subcategory';
      //   setDeleteError(errorMessage);
      // }
    } catch (err: unknown) {
      console.error('Error deleting subcategory:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const resp = (err as { response?: { data?: unknown } }).response;
        console.error('Error response:', resp?.data);
      }
      if (err && typeof err === 'object' && 'message' in err) {
        setDeleteError(`Failed to delete subcategory: ${(err as { message?: string }).message || 'Unknown error'}`);
      } else {
        setDeleteError('Failed to delete subcategory: Unknown error');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Success Toast Notification */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center p-4 mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
            <span className="sr-only">Success icon</span>
          </div>
          <div className="ml-3 text-sm font-medium">{successMessage}</div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>
      )}
      <ComponentCard title="Product Sub-Categories">
        <Form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Category Select */}
                <div>
                  <Label htmlFor="category">Select Category</Label>
                  {isLoading ? (
                    <div className="py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      Loading categories...
                    </div>
                  ) : (
                    <Select
                      options={categoryOptions}
                      placeholder="Select parent category"
                      value={selectedCategoryId}
                      onChange={(value) => {
                        console.log('Category selected:', value);
                        setSelectedCategoryId(value);
                        // In a real app, we would store the category name
                        // const category = categories.find(cat => cat.id === value);
                        // if (category) {
                        //   // Use category name for display or API calls
                        // }
                      }}
                    />
                  )}
                  {deleteError && (
                    <p className="mt-1 text-sm text-red-500">{deleteError}</p>
                  )}
                </div>

                {/* Sub-Category Input */}
                <div>
                  <Label htmlFor="subCategory">Sub-Category Name</Label>
                  <Input
                    type="text"
                    id="subCategory"
                    placeholder="Enter sub-category name"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                  />
                </div>

                {/* Sub-Category Description */}
                <div>
                  <Label htmlFor="description">Sub-Category Description</Label>
                  <TextArea
                    id="description"
                    placeholder="Enter sub-category description"
                    value={description}
                    onChange={(value) => setDescription(value)}
                    rows={4}
                  />
                </div>
              </div>

              {/* Right Column - Dropzone */}
              <div>
                <Label>Sub-Category Image</Label>
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
                    {/* Show preview if available */}
                    {subCategoryImagePreview ? (
                      <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 mb-4">
                          <Image
                            src={subCategoryImagePreview}
                            alt="Sub-category preview"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click or drag to replace image
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
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
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Drag & drop sub-category image here or click to select
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-start">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-colors duration-150 bg-brand-500 border border-transparent rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                Add Sub-Category
              </button>
            </div>

            {/* Sub-Categories List */}
            {subCategories.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Sub-Categories List
                </h3>
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Image
                          </th>
                          <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Sub-Category
                          </th>
                          <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {subCategories.map((item) => (
                          <tr key={`subcategory-${item.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 h-[72px]">
                            <td className="px-5 py-4 sm:px-6 text-start">
                              {item.imageUrl && (
                                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                                  <Image
                                    width={40}
                                    height={40}
                                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${item.imageUrl}`}
                                    alt={item.name}
                                    priority={true}
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-4 sm:px-6 text-start">
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
                                {item.categoryName || 'Unknown Category'}
                              </span>
                            </td>
                            <td className="px-5 py-4 sm:px-6 text-start">
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">{item.name}</span>
                            </td>
                            <td className="px-5 py-4 sm:px-6 text-start text-gray-700 text-theme-sm dark:text-gray-300">
                              {item.description}
                            </td>
                            <td className="px-5 py-4 sm:px-6 text-start">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                item.status === 'active' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              }`}>
                                {item.status || 'active'}
                              </span>
                            </td>
                            <td className="px-5 py-4 sm:px-6 text-start text-gray-700 text-theme-sm dark:text-gray-300">
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="inline-flex items-center justify-center p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-500/10"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="inline-flex items-center justify-center p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-500/10"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Form>
      </ComponentCard>

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
            </svg>
            <div className="absolute flex items-center justify-center w-[62px] h-[62px] rounded-full border-[6px] border-white dark:border-gray-900 bg-error-500 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </div>
          </div>

          <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90">
            Delete Subcategory
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this subcategory? This action cannot be undone.
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

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] p-5 lg:p-6">
        <div className="mb-5">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Edit Sub-Category
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update sub-category details
          </p>
        </div>

        <form className="space-y-4">
          {/* Sub-Category Image */}
          <div>
            <Label>Sub-Category Image</Label>
            <div className="mt-2 flex flex-col items-center justify-center gap-3">
              <div className="relative h-32 w-32">
                <Image
                  src={imagePreview || "/images/product/product-default.png"}
                  alt={editForm.name || 'Subcategory image'}
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
          <div className="space-y-3">
            <div>
              <Label>Category</Label>
              {isLoading ? (
                <div className="py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  Loading categories...
                </div>
              ) : (
                <EditCategorySelect
                  options={categoryOptions}
                  initialValue={editForm.categoryId}
                  onChange={(value) => {
                    try {
                      const categoryId = parseInt(value);
                      if (isNaN(categoryId)) {
                        console.error('Invalid category ID:', value);
                        return;
                      }
                      // Find the category name
                      const category = categories.find(cat => cat.id === String(categoryId));
                      if (!category) {
                        console.warn('Category not found for ID:', categoryId);
                      }

                      // Log before update
                      console.log('Before update - editForm:', { ...editForm });
                      console.log('Selected categoryId:', categoryId, 'type:', typeof categoryId);
                      console.log('Found category:', category);

                      // Update the form with the new categoryId
                      const updatedForm = {
                        ...editForm,
                        categoryId: value, // value is already a string
                        categoryName: category ? category.name : "Unknown Category"
                      };

                      setEditForm(updatedForm);

                      // Log after update
                      console.log('After update - editForm should be:', updatedForm);
                      console.log('Updated category ID to:', categoryId, 'type:', typeof categoryId);
                    } catch (error) {
                      console.error('Error updating category:', error);
                    }
                  }}
                  placeholder="Select category"
                  className="w-full"
                />
              )}
            </div>

            <div>
              <Label>Sub-Category Name</Label>
              <Input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({...editForm, name: e.target.value, subCategory: e.target.value})}
                className="w-full"
              />
            </div>

            <div>
              <Label>Description</Label>
              <TextArea
                value={editForm.description}
                onChange={(value) => setEditForm({...editForm, description: value})}
                rows={4}
                className="w-full"
              />
            </div>
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
              onClick={handleSave}
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
    </>
  );
}






