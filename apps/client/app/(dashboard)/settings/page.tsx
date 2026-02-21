'use client';

import { useSettings, useUpdateSettings } from '@/hooks';
import { RestaurantSettings } from '@/lib/types';

import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { toast } from '@workspace/ui/components/sonner';
import {
  DollarSign,
  Loader2,
  Mail,
  MapPin,
  Percent,
  Phone,
  Store,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    taxPercentage: '',
    serviceChargePercentage: '',
    currency: 'USD',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name ?? '',
        address: settings.address ?? '',
        phone: settings.phone ?? '',
        email: settings.email ?? '',
        taxPercentage: settings.taxPercentage?.toString() ?? '5',
        serviceChargePercentage:
          settings.serviceChargePercentage?.toString() ?? '0',
        currency: settings.currency ?? 'USD',
      });
    }
  }, [settings]);

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <Form settings={settings!} />
    </div>
  );
}

const Form = ({ settings }: { settings: RestaurantSettings }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: settings?.name ?? '',
      address: settings?.address ?? '',
      phone: settings?.phone ?? '',
      email: settings?.email ?? '',
      taxPercentage: settings?.taxPercentage?.toString() ?? '5',
      serviceChargePercentage:
        settings?.serviceChargePercentage?.toString() ?? '0',
      currency: settings?.currency ?? 'USD',
    },
  });
  const updateMutation = useUpdateSettings();

  const onSubmit = async (data: FieldValues) => {
    try {
      await updateMutation.mutateAsync({
        ...data,
        taxPercentage: parseFloat(data.taxPercentage),
        serviceChargePercentage: parseFloat(data.serviceChargePercentage),
      });
      toast.success('Settings updated successfully');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Failed to update settings');
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='flex gap-4'>
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Store className='h-5 w-5' />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <Label>Restaurant Name *</Label>
              <Input
                {...register('name', {
                  required: 'Restaurant name is required',
                })}
                placeholder='Your Restaurant Name'
              />
            </div>
            <div>
              <Label className='flex items-center gap-2'>
                <MapPin className='h-4 w-4' />
                Address
              </Label>
              <Input {...register('address')} placeholder='Full address' />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label className='flex items-center gap-2'>
                  <Phone className='h-4 w-4' />
                  Phone
                </Label>
                <Input {...register('phone')} placeholder='+1 234 567 890' />
              </div>
              <div>
                <Label className='flex items-center gap-2'>
                  <Mail className='h-4 w-4' />
                  Email
                </Label>
                <Input
                  type='email'
                  {...register('email')}
                  placeholder='contact@restaurant.com'
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='flex-1'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <DollarSign className='h-5 w-5' />
              Billing Settings
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-4'>
              <div>
                <Label className='flex items-center gap-2'>
                  <Percent className='h-4 w-4' />
                  Tax Percentage
                </Label>
                <Input
                  type='number'
                  min={0}
                  max={100}
                  step='0.01'
                  {...register('taxPercentage')}
                  placeholder='5'
                />
              </div>
              <div>
                <Label className='flex items-center gap-2'>
                  <Percent className='h-4 w-4' />
                  Service Charge
                </Label>
                <Input
                  type='number'
                  min={0}
                  max={100}
                  step='0.01'
                  {...register('serviceChargePercentage')}
                  placeholder='0'
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Input
                  {...register('currency')}
                  placeholder='USD'
                  maxLength={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Button
        type='submit'
        className='w-full'
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Saving...
          </>
        ) : (
          'Save Settings'
        )}
      </Button>
    </form>
  );
};
