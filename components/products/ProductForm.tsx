"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom ui/ImageUpload";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Delete from "../custom ui/Delete";
import MultiText from "../custom ui/MultiText";
import MultiSelect from "../custom ui/MultiSelect";
import Loader from "../custom ui/Loader";

const formSchema = z.object({
  title: z.string().min(2).max(20),
  description: z.string().min(2).max(500).trim(),
  media: z.array(z.string()),
  category: z.string(),
  collections: z.array(z.string()),
  onsales: z.array(z.string()), // Added onsales field
  tags: z.array(z.string()),
  sizes: z.array(z.string()),
  colors: z.array(z.string()),
  price: z.coerce.number().min(0.1),
  expense: z.coerce.number().min(0.1),
});

interface ProductFormProps {
  initialData?: ProductType | null; // Must have "?" to make it optional
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [onsales, setOnsales] = useState<OnsaleType[]>([]); // Added state for onsales

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", { method: "GET" });
      const data = await res.json();
      setCollections(data);
    } catch (err) {
      console.log("[collections_GET]", err);
      toast.error("Error fetching collections! Please try again.");
    }
  };

  const getOnsales = async () => {
    try {
      const res = await fetch("/api/onsales", { method: "GET" });
      const data = await res.json();
      setOnsales(data);
    } catch (err) {
      console.log("[onsales_GET]", err);
      toast.error("Error fetching onsales! Please try again.");
    }
  };

  useEffect(() => {
    Promise.all([getCollections(), getOnsales()]).then(() => setLoading(false));
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          collections: initialData.collections.map((collection) => collection._id),
          onsales: initialData.onsales.map((onsale) => onsale._id), // Map initial onsales data
        }
      : {
          title: "",
          description: "",
          media: [],
          category: "",
          collections: [],
          onsales: [], // Default empty onsales
          tags: [],
          sizes: [],
          colors: [],
          price: 0.1,
          expense: 0.1,
        },
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/products/${initialData._id}`
        : "/api/products";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setLoading(false);
        toast.success(`Product ${initialData ? "updated" : "created"}`);
        router.push("/products");
      }
    } catch (err) {
      console.log("[products_POST]", err);
      toast.error("Error submitting product! Please try again.");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="p-10">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Edit Product</p>
          <Delete id={initialData._id} item="product" />
        </div>
      ) : (
        <p className="text-heading2-bold">Create Product</p>
      )}
      <Separator className="bg-grey-1 mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} onKeyDown={handleKeyPress} />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    {...field}
                    rows={5}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          {/* Media */}
          <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) =>
                      field.onChange(field.value.filter((image) => image !== url))
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          {/* Dynamic Fields */}
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {/* Expense */}
            <FormField
              control={form.control}
              name="expense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Expense"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field} onKeyDown={handleKeyPress} />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Tags"
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tagToRemove) =>
                        field.onChange(field.value.filter((tag) => tag !== tagToRemove))
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {/* Collections */}
            {collections.length > 0 && (
              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collections</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Collections"
                        options={collections}
                        value={field.value}
                        onChange={(id) => field.onChange([...field.value, id])}
                        onRemove={(idToRemove) =>
                          field.onChange(field.value.filter((id) => id !== idToRemove))
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />
            )}
            {/* Onsales */}
            {onsales.length > 0 && (
              <FormField
                control={form.control}
                name="onsales"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>On Sales</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="On Sales"
                        options={onsales}
                        value={field.value}
                        onChange={(id) => field.onChange([...field.value, id])}
                        onRemove={(idToRemove) =>
                          field.onChange(field.value.filter((id) => id !== idToRemove))
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />
            )}
          </div>
          <Button type="submit" className="mt-4">
            {initialData ? "Update Product" : "Create Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
