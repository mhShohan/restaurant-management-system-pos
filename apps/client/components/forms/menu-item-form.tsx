'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCategories } from '@/hooks';
import { cn } from '@/lib/utils';

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MenuItemFormProps {
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

export function MenuItemForm({
  initialData,
  onSubmit,
  isLoading,
}: MenuItemFormProps) {
  const { data: categories } = useCategories();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true,
    isVeg: true,
    imageUrl: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? '',
        description: initialData.description ?? '',
        price: initialData.price?.toString() ?? '',
        category:
          typeof initialData.category === 'object'
            ? initialData.category._id
            : (initialData.category ?? ''),
        isAvailable: initialData.isAvailable ?? true,
        isVeg: initialData.isVeg ?? true,
        imageUrl: initialData.imageUrl ?? '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Name *</Label>
          <Input
            id='name'
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder='0.00'
            required
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='category'>Category *</Label>
        <select
          id='category'
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
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
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder='Item description'
          rows={3}
        />
      </div>

      <div className='flex gap-6'>
        <div className='flex items-center gap-2'>
          <Switch
            id='isAvailable'
            checked={formData.isAvailable}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isAvailable: checked })
            }
          />
          <Label htmlFor='isAvailable'>Available</Label>
        </div>
        <div className='flex items-center gap-2'>
          <Switch
            id='isVeg'
            checked={formData.isVeg}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isVeg: checked })
            }
          />
          <Label htmlFor='isVeg'>Vegetarian</Label>
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='imageUrl'>Image URL</Label>
        <Input
          id='imageUrl'
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
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
}
