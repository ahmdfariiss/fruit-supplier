'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/validators/authSchema';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';

function getPasswordStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthLabels = ['', 'Lemah', 'Lemah', 'Sedang', 'Kuat'];
const strengthColors = ['', '#e84d1c', '#e84d1c', '#f0a500', '#6aab1a'];

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const watchPw = watch('password', '');
  const currentStrength = watchPw ? getPasswordStrength(watchPw) : 0;

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      await registerUser(
        data.name,
        data.email,
        data.phone,
        data.password,
        data.confirmPassword,
      );
      toast('Akun berhasil dibuat!', 'success');
      router.push('/');
    } catch {
      toast('Gagal mendaftar. Coba lagi.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout activeTab="register">
      <h2 className="font-lora text-[1.7rem] font-semibold tracking-tight mb-1">
        Buat <em className="not-italic text-g2">Akun</em> Baru
      </h2>
      <p className="text-[0.83rem] text-muted mb-5 leading-relaxed">
        Gratis selamanya. Mulai belanja buah segar hari ini.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name row */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[0.73rem] font-bold text-muted tracking-[0.04em] uppercase">
              Nama Lengkap *
            </label>
            <div className="inp-wrap">
              <input
                type="text"
                placeholder="Nama lengkap"
                className={errors.name ? 'err' : ''}
                {...register('name')}
              />
            </div>
            {errors.name && (
              <span className="text-[0.71rem] text-[#e84d1c]">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[0.73rem] font-bold text-muted tracking-[0.04em] uppercase">
              No. WhatsApp *
            </label>
            <div className="inp-wrap">
              <input
                type="text"
                placeholder="08xxxxxxxxxx"
                className={errors.phone ? 'err' : ''}
                {...register('phone')}
              />
              <span className="inp-ico">📱</span>
            </div>
            {errors.phone && (
              <span className="text-[0.71rem] text-[#e84d1c]">
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1 mb-3.5">
          <label className="text-[0.73rem] font-bold text-muted tracking-[0.04em] uppercase">
            Email *
          </label>
          <div className="inp-wrap">
            <input
              type="email"
              placeholder="email@contoh.com"
              className={errors.email ? 'err' : ''}
              {...register('email')}
            />
            <span className="inp-ico">📧</span>
          </div>
          {errors.email && (
            <span className="text-[0.71rem] text-[#e84d1c]">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1 mb-3.5">
          <label className="text-[0.73rem] font-bold text-muted tracking-[0.04em] uppercase">
            Password *
          </label>
          <div className="inp-wrap">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Minimal 8 karakter"
              className={errors.password ? 'err' : ''}
              {...register('password')}
            />
            <span className="inp-ico" onClick={() => setShowPw(!showPw)}>
              {showPw ? '🙈' : '👁️'}
            </span>
          </div>
          {/* Strength bars */}
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[3px] flex-1 rounded-full transition-colors duration-300"
                style={{
                  background:
                    currentStrength >= i
                      ? strengthColors[currentStrength]
                      : '#c8ddb0',
                }}
              />
            ))}
          </div>
          <div
            className="text-[0.68rem] mt-0.5"
            style={{
              color: currentStrength
                ? strengthColors[currentStrength]
                : '#5a6e47',
            }}
          >
            {watchPw ? strengthLabels[currentStrength] : 'Masukkan password'}
          </div>
          {errors.password && (
            <span className="text-[0.71rem] text-[#e84d1c]">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1 mb-3.5">
          <label className="text-[0.73rem] font-bold text-muted tracking-[0.04em] uppercase">
            Konfirmasi Password *
          </label>
          <div className="inp-wrap">
            <input
              type="password"
              placeholder="Ulangi password"
              className={errors.confirmPassword ? 'err' : ''}
              {...register('confirmPassword')}
            />
            <span className="inp-ico">🔑</span>
          </div>
          {errors.confirmPassword && (
            <span className="text-[0.71rem] text-[#e84d1c]">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-g1 text-white border-none py-3.5 rounded-pill text-[0.92rem] font-extrabold cursor-pointer font-cabinet transition-all duration-200 shadow-[0_4px_20px_rgba(45,90,0,0.28)] mt-1 hover:bg-g2 hover:-translate-y-0.5 disabled:bg-faint disabled:text-muted disabled:transform-none disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Mendaftar...
            </>
          ) : (
            <>🌿 Buat Akun Gratis</>
          )}
        </button>

        <p className="text-[0.72rem] text-muted text-center mt-3 leading-relaxed">
          Dengan mendaftar kamu menyetujui{' '}
          <a
            href="#"
            className="text-g2 font-bold no-underline hover:underline"
          >
            Syarat & Ketentuan
          </a>{' '}
          BuahKita.
        </p>
        <p className="text-[0.72rem] text-muted text-center mt-2 leading-relaxed">
          Sudah punya akun?{' '}
          <Link
            href="/auth/login"
            className="text-g2 font-bold no-underline hover:underline"
          >
            Masuk di sini →
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
