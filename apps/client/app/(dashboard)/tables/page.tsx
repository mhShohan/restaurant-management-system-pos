'use client';

import {
  useCreateTable,
  useDeleteTable,
  useTables,
  useUpdateTable,
} from '@/hooks';
import { type Table, TableStatus } from '@/lib/types';

import { Badge } from '@workspace/ui/components/badge';
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
import { Label } from '@workspace/ui/components/label';
import { toast } from '@workspace/ui/components/sonner';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

export default function TablesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState({ tableNumber: '', capacity: '' });

  const { data: tables, isLoading } = useTables();
  const createMutation = useCreateTable();
  const updateMutation = useUpdateTable();
  const deleteMutation = useDeleteTable();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      tableNumber: formData.tableNumber,
      capacity: parseInt(formData.capacity, 10),
    };

    try {
      if (editingTable) {
        await updateMutation.mutateAsync({ id: editingTable._id, data });
        toast.success('Table updated');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Table created');
      }
      setIsDialogOpen(false);
      setEditingTable(null);
      setFormData({ tableNumber: '', capacity: '' });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Table deleted');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Failed to delete table');
    }
  };

  const openEditDialog = (table: Table) => {
    setEditingTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity.toString(),
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingTable(null);
    setFormData({ tableNumber: '', capacity: '' });
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: TableStatus) => {
    const colors = {
      [TableStatus.AVAILABLE]:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      [TableStatus.OCCUPIED]:
        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      [TableStatus.RESERVED]:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return (
      colors[status] ??
      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-end'>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className='mr-2 h-4 w-4' />
              Add Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTable ? 'Edit Table' : 'Add Table'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <Label>Table Number *</Label>
                <Input
                  value={formData.tableNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, tableNumber: e.target.value })
                  }
                  placeholder='e.g., A1, B2'
                  required
                />
              </div>
              <div>
                <Label>Capacity *</Label>
                <Input
                  type='number'
                  min={1}
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  placeholder='Number of seats'
                  required
                />
              </div>
              <Button type='submit' className='w-full'>
                {editingTable ? 'Update Table' : 'Create Table'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className='h-40' />
          ))}
        </div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {tables?.map((table) => (
            <Card key={table._id}>
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <div>
                    <CardTitle className='text-2xl'>
                      Table {table.tableNumber}
                    </CardTitle>
                    <div className='text-muted-foreground mt-2 flex items-center gap-2'>
                      <Users className='h-4 w-4' />
                      <span>Capacity: {table.capacity}</span>
                    </div>
                  </div>
                  <Badge className={getStatusBadge(table.status)}>
                    {table.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => openEditDialog(table)}
                  >
                    <Pencil className='mr-1 h-4 w-4' />
                    Edit
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleDelete(table._id)}
                    className='text-destructive'
                  >
                    <Trash2 className='mr-1 h-4 w-4' />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
