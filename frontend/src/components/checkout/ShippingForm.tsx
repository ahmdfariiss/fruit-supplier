'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import Input from '@/components/ui/Input';
import type { CheckoutInput } from '@/validators/checkoutSchema';

interface ShippingFormProps {
  register: UseFormRegister<CheckoutInput>;
  errors: FieldErrors<CheckoutInput>;
}

export default function ShippingForm({ register, errors }: ShippingFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-ink text-lg mb-4">Alamat Pengiriman</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nama Penerima"
          placeholder="Nama lengkap"
          error={errors.shippingName?.message}
          {...register('shippingName')}
        />
        <Input
          label="No. Telepon"
          placeholder="08xx xxxx xxxx"
          error={errors.shippingPhone?.message}
          {...register('shippingPhone')}
        />
      </div>

      <Input
        label="Alamat Lengkap"
        placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos"
        error={errors.shippingAddress?.message}
        {...register('shippingAddress')}
      />

      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">
          Catatan (Opsional)
        </label>
        <textarea
          placeholder="Catatan untuk kurir atau penjual..."
          className="w-full px-4 py-3 rounded-2xl border border-faint bg-white text-sm
            focus:outline-none focus:ring-2 focus:ring-g3/30 focus:border-g3
            transition-all resize-none h-24"
          {...register('notes')}
        />
      </div>
    </div>
  );
}
