'use client';

import {
  useCreateUser,
  useDeleteUser,
  useToggleUserStatus,
  useUpdateUser,
  useUsers,
} from '@/hooks';
import { UserRole, UserStatus } from '@/lib/types';

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
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { toast } from '@workspace/ui/components/sonner';
import { Pencil, Plus, Trash2, UserCheck, UserX } from 'lucide-react';
import { useState } from 'react';

export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<{
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'waiter' as UserRole,
  });

  const { data: users, isLoading } = useUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const { password, ...updateData } = formData;
        await updateMutation.mutateAsync({
          id: editingUser._id,
          data: updateData,
        });
        toast.success('User updated');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('User created');
      }
      setIsDialogOpen(false);
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'waiter' as UserRole,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('User deleted');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Failed to delete user');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatusMutation.mutateAsync(id);
      toast.success('User status updated');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Failed to update status');
    }
  };

  const openEditDialog = (user: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
  }) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'waiter' as UserRole,
    });
    setIsDialogOpen(true);
  };

  const getRoleBadge = (role: UserRole) => {
    const colors: Record<string, string> = {
      [UserRole.ADMIN]:
        'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      [UserRole.CASHIER]:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      [UserRole.WAITER]:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      [UserRole.KITCHEN]:
        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return (
      colors[role] ??
      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>User Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className='mr-2 h-4 w-4' />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit User' : 'Add User'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder='Full name'
                  required
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder='email@example.com'
                  required
                />
              </div>
              {!editingUser && (
                <div>
                  <Label>Password *</Label>
                  <Input
                    type='password'
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder='Min 6 characters'
                    required={!editingUser}
                  />
                </div>
              )}
              <div>
                <Label>Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value as UserRole })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.CASHIER}>Cashier</SelectItem>
                    <SelectItem value={UserRole.WAITER}>Waiter</SelectItem>
                    <SelectItem value={UserRole.KITCHEN}>Kitchen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type='submit' className='w-full'>
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-150'>
            {isLoading ? (
              <div className='space-y-3'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className='h-20 rounded-lg border' />
                ))}
              </div>
            ) : users && users.length > 0 ? (
              <div className='space-y-3'>
                {users.map(
                  (user: {
                    _id: string;
                    name: string;
                    email: string;
                    role: UserRole;
                    status: UserStatus;
                  }) => (
                    <div
                      key={user._id}
                      className='flex items-center justify-between rounded-lg border p-4'
                    >
                      <div className='flex items-center gap-4'>
                        <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                          <span className='text-primary font-medium'>
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className='font-medium'>{user.name}</p>
                          <p className='text-muted-foreground text-sm'>
                            {user.email}
                          </p>
                          <div className='mt-1 flex items-center gap-2'>
                            <Badge className={getRoleBadge(user.role)}>
                              {user.role}
                            </Badge>
                            <Badge
                              variant={
                                user.status === UserStatus.ACTIVE
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleToggleStatus(user._id)}
                          title={
                            user.status === UserStatus.ACTIVE
                              ? 'Deactivate'
                              : 'Activate'
                          }
                        >
                          {user.status === UserStatus.ACTIVE ? (
                            <UserX className='text-destructive h-4 w-4' />
                          ) : (
                            <UserCheck className='h-4 w-4 text-green-500' />
                          )}
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => openEditDialog(user)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDelete(user._id)}
                          className='text-destructive'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className='text-muted-foreground py-8 text-center'>
                No users found
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
