"use client";

import Select from "@/components/form/Select";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { TCategory } from "@/types/category";
import { useState } from "react";

export default function CategoryFilter({
  categories,
}: {
  categories: TCategory[];
}) {
   const updateQuery = useUpdateQuery();
  const [categoryId, setCategoryId] = useState("");
  const handleCategoryChange = (value : string)=>{
    updateQuery({category : value || undefined},true);
    setCategoryId(()=> value);
  }
  return (
    <Select
      options={[{label : "All",value : ""},...categories.map((c) => ({
        label: c.name,
        value: c._id,
      }))]}
      value={categoryId}
      onChange={handleCategoryChange}
    />
  );
}
