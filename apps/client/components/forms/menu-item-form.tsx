'use client';

import { useCategories } from '@/hooks';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Switch } from '@workspace/ui/components/switch';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';
import { Loader2 } from 'lucide-react';
import { Controller, FieldValues, useForm } from 'react-hook-form';

interface Props {
  initialData?: {
    name?: string;
    description?: string;
    price?: number;
    category?: { _id: string } | string;
    isAvailable?: boolean;
    isVeg?: boolean;
    imageUrl?: string;
  };
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading: boolean;
}

const MenuItemForm = ({ initialData, isLoading, onSubmit }: Props) => {
  const { data: categories } = useCategories();
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      price: initialData?.price?.toString() ?? '',
      category:
        typeof initialData?.category === 'object'
          ? initialData.category._id
          : (initialData?.category ?? ''),
      isAvailable: initialData?.isAvailable ?? true,
      isVeg: initialData?.isVeg ?? true,
      imageUrl: initialData?.imageUrl ?? '',
    },
  });

  const onSubmitForm = (data: FieldValues) => {
    onSubmit({
      ...data,
      price: parseFloat(data.price),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Name *</Label>
          <Input
            id='name'
            {...register('name', { required: true })}
            placeholder='Item name'
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='price'>Price *</Label>
          <Input
            id='price'
            type='number'
            step='0.01'
            min='0'
            {...register('price', { required: true })}
            placeholder='0.00'
            required
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='category'>Category *</Label>
        <select
          id='category'
          {...register('category', { required: true })}
          className={cn(
            'border-input shadow-xs focus-visible:ring-ring w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2'
          )}
          required
        >
          <option value=''>Select a category</option>
          {categories?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Description</Label>
        <Textarea
          id='description'
          {...register('description')}
          placeholder='Item description'
          rows={3}
        />
      </div>

      <div className='flex gap-6'>
        <div className='flex items-center gap-2'>
          <Controller
            name='isAvailable'
            control={control}
            render={({ field }) => (
              <Switch
                id='isAvailable'
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor='isAvailable'>Available</Label>
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='imageUrl'>Image URL</Label>
        <Input
          id='imageUrl'
          {...register('imageUrl')}
          placeholder='https://example.com/image.jpg'
        />
      </div>

      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Saving...
          </>
        ) : initialData ? (
          'Update Item'
        ) : (
          'Create Item'
        )}
      </Button>
    </form>
  );
};

export default MenuItemForm;
