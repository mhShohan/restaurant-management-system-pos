'use client';

import { useSettings, useUpdateSettings } from '@/hooks';

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

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        taxPercentage: parseFloat(formData.taxPercentage),
        serviceChargePercentage: parseFloat(formData.serviceChargePercentage),
        currency: formData.currency,
      });
      toast.success('Settings updated successfully');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message ?? 'Failed to update settings');
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>
          Restaurant Settings
        </h2>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <Card>
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
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder='Your Restaurant Name'
                required
              />
            </div>
            <div>
              <Label className='flex items-center gap-2'>
                <MapPin className='h-4 w-4' />
                Address
              </Label>
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder='Full address'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label className='flex items-center gap-2'>
                  <Phone className='h-4 w-4' />
                  Phone
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder='+1 234 567 890'
                />
              </div>
              <div>
                <Label className='flex items-center gap-2'>
                  <Mail className='h-4 w-4' />
                  Email
                </Label>
                <Input
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder='contact@restaurant.com'
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <DollarSign className='h-5 w-5' />
              Billing Settings
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-3 gap-4'>
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
                  value={formData.taxPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, taxPercentage: e.target.value })
                  }
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
                  value={formData.serviceChargePercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      serviceChargePercentage: e.target.value,
                    })
                  }
                  placeholder='0'
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Input
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  placeholder='USD'
                  maxLength={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
    </div>
  );
}
