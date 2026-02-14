'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks';

import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function CategoryForm() {
  const { data: categories, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    try {
      await createMutation.mutateAsync(formData);
      toast.success('Category created');
      setFormData({ name: '', description: '' });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Failed to create category');
    }
  };

  const handleUpdate = async () => {
    if (!editingId || !formData.name.trim()) return;
    try {
      await updateMutation.mutateAsync({ id: editingId, data: formData });
      toast.success('Category updated');
      setEditingId(null);
      setFormData({ name: '', description: '' });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Failed to update category');
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm('Are you sure? This will fail if items are using this category.')
    )
      return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Category deleted');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Failed to delete category');
    }
  };

  const startEdit = (category: {
    _id: string;
    name: string;
    description?: string;
  }) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      description: category.description ?? '',
    });
  };

  return (
    <div className='space-y-4'>
      <div className='space-y-3 rounded-lg border p-4'>
        <div>
          <Label>Category Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder='e.g., Starters'
          />
        </div>
        <div>
          <Label>Description</Label>
          <Input
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder='Optional description'
          />
        </div>
        <div className='flex gap-2'>
          {editingId ? (
            <>
              <Button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  'Update'
                )}
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', description: '' });
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <>
                  <Plus className='mr-1 h-4 w-4' />
                  Add Category
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <Label>Existing Categories</Label>
        <div className='max-h-[300px] space-y-2 overflow-y-auto'>
          {isLoading ? (
            <div className='py-4 text-center'>Loading...</div>
          ) : (
            categories?.map((category) => (
              <div
                key={category._id}
                className='flex items-center justify-between rounded-lg border p-3'
              >
                <div>
                  <p className='font-medium'>{category.name}</p>
                  {category.description && (
                    <p className='text-muted-foreground text-sm'>
                      {category.description}
                    </p>
                  )}
                </div>
                <div className='flex gap-1'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => startEdit(category)}
                  >
                    <Pencil className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleDelete(category._id)}
                    disabled={deleteMutation.isPending}
                    className='text-destructive'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
