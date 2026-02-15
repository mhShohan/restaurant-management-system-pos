'use client';

import { CategoryForm } from '@/components/forms/category-form';
import { MenuItemForm } from '@/components/forms/menu-item-form';
import {
  useCategories,
  useCreateMenuItem,
  useDeleteMenuItem,
  useMenuItems,
  useToggleMenuItemAvailability,
  useUpdateMenuItem,
} from '@/hooks';
import type { MenuItem } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { toast } from '@workspace/ui/components/sonner';
import { Switch } from '@workspace/ui/components/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import { Leaf, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const { data: menuItems, isLoading: itemsLoading } = useMenuItems({
    search: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
  });
  const { data: categories } = useCategories();
  const createItemMutation = useCreateMenuItem();
  const updateItemMutation = useUpdateMenuItem();
  const deleteItemMutation = useDeleteMenuItem();
  const toggleAvailabilityMutation = useToggleMenuItemAvailability();

  const handleCreateItem = async (data: Record<string, unknown>) => {
    try {
      await createItemMutation.mutateAsync(
        data as Parameters<typeof createItemMutation.mutateAsync>[0]
      );
      toast.success('Menu item created successfully');
      setIsItemDialogOpen(false);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Failed to create item');
    }
  };

  const handleUpdateItem = async (data: Record<string, unknown>) => {
    if (!editingItem) return;
    try {
      await updateItemMutation.mutateAsync({
        id: editingItem._id,
        data: data as Parameters<
          typeof updateItemMutation.mutateAsync
        >[0]['data'],
      });
      toast.success('Menu item updated successfully');
      setIsItemDialogOpen(false);
      setEditingItem(null);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Failed to update item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteItemMutation.mutateAsync(id);
      toast.success('Menu item deleted successfully');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Failed to delete item');
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      await toggleAvailabilityMutation.mutateAsync(id);
      toast.success('Availability updated');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err.response?.data?.message ?? 'Failed to update availability'
      );
    }
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setIsItemDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setIsItemDialogOpen(true);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>Menu Management</h2>
        <div className='flex gap-2'>
          <Dialog
            open={isCategoryDialogOpen}
            onOpenChange={setIsCategoryDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant='outline'>
                <Plus className='mr-2 h-4 w-4' />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Categories</DialogTitle>
              </DialogHeader>
              <CategoryForm />
            </DialogContent>
          </Dialog>

          <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className='mr-2 h-4 w-4' />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl'>
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                </DialogTitle>
              </DialogHeader>
              <MenuItemForm
                initialData={editingItem ?? undefined}
                onSubmit={editingItem ? handleUpdateItem : handleCreateItem}
                isLoading={
                  createItemMutation.isPending || updateItemMutation.isPending
                }
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className='flex gap-4'>
        <div className='relative max-w-sm flex-1'>
          <Search className='text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2' />
          <Input
            placeholder='Search menu items...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className='flex-wrap'>
          <TabsTrigger value='all'>All Items</TabsTrigger>
          {categories?.map((category) => (
            <TabsTrigger key={category._id} value={category._id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className='mt-6'>
          {itemsLoading ? (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className='h-48' />
              ))}
            </div>
          ) : menuItems && menuItems.length > 0 ? (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {menuItems.map((item) => (
                <Card
                  key={item._id}
                  className={!item.isAvailable ? 'opacity-60' : ''}
                >
                  <CardHeader className='pb-3'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <CardTitle className='flex items-center gap-2 text-lg'>
                          {item.name}
                          {item.isVeg && (
                            <Leaf className='h-4 w-4 text-green-500' />
                          )}
                        </CardTitle>
                        <p className='text-muted-foreground mt-1 text-sm'>
                          {typeof item.category === 'object'
                            ? item.category.name
                            : item.category}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-lg font-bold'>
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground mb-4 line-clamp-2 text-sm'>
                      {item.description ?? 'No description'}
                    </p>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Switch
                          checked={item.isAvailable}
                          onCheckedChange={() =>
                            handleToggleAvailability(item._id)
                          }
                        />
                        <span className='text-sm'>
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div className='flex gap-2'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => openEditDialog(item)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDeleteItem(item._id)}
                          className='text-destructive'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className='text-muted-foreground py-12 text-center'>
              No menu items found
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
