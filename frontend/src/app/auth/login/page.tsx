'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/validators/authSchema';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout';
import {
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  UnlockIcon,
} from '@/components/ui/icons';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast('Berhasil masuk! Mengarahkan...', 'success');
      router.push('/');
    } catch {
      toast('Email atau password salah', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout activeTab="login">
      <h2 className="font-lora text-[1.7rem] font-semibold tracking-tight mb-1">
        Selamat <em className="not-italic text-g2">Datang</em> Kembali
      </h2>
      <p className="text-[0.83rem] text-muted mb-6 leading-relaxed">
        Masuk ke akun BuahKita kamu untuk lanjut belanja atau cek pesanan.
      </p>

      {/* Social Buttons */}
      {/* <div className="flex gap-2 mb-4">
        <button className="flex-1 border-[1.5px] border-faint bg-white rounded-xl py-2.5 px-3 cursor-pointer text-[0.8rem] font-bold font-cabinet text-ink transition-all duration-200 flex items-center justify-center gap-1.5 hover:border-muted hover:bg-g6">
          🌐 Google
        </button>
        <button className="flex-1 border-[1.5px] border-faint bg-white rounded-xl py-2.5 px-3 cursor-pointer text-[0.8rem] font-bold font-cabinet text-ink transition-all duration-200 flex items-center justify-center gap-1.5 hover:border-muted hover:bg-g6">
          📘 Facebook
        </button>
      </div> */}

      {/* <div className="flex items-center gap-2.5 my-4 text-muted text-[0.78rem] font-semibold">
        <span className="flex-1 h-px bg-faint" />
        atau masuk dengan email
        <span className="flex-1 h-px bg-faint" />
      </div> */}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="flex flex-col gap-1 mb-3.5">
          <label className="text-[0.73rem] font-bold text-muted tracking-[0.04em] uppercase">
            Email
          </label>
          <div className="inp-wrap">
            <input
              type="email"
              placeholder="email@contoh.com"
              className={errors.email ? 'err' : ''}
              {...register('email')}
            />
            <span className="inp-ico">
              <MailIcon className="w-4 h-4" />
            </span>
          </div>
          {errors.email && (
            <span className="text-[0.71rem] text-[#e84d1c]">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1 mb-2">
          <label className="text-[0.73rem] font-bold text-muted tracking-[0.04em] uppercase">
            Password
          </label>
          <div className="inp-wrap">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Password kamu"
              className={errors.password ? 'err' : ''}
              {...register('password')}
            />
            <span className="inp-ico" onClick={() => setShowPw(!showPw)}>
              {showPw ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </span>
          </div>
          {errors.password && (
            <span className="text-[0.71rem] text-[#e84d1c]">
              {errors.password.message}
            </span>
          )}
        </div>

        <a
          href="#"
          className="text-[0.76rem] text-g2 font-bold no-underline block text-right -mt-0.5 mb-3.5 hover:underline"
        >
          Lupa password?
        </a>

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
              Masuk...
            </>
          ) : (
            <>
              <UnlockIcon className="w-4 h-4" /> Masuk ke Akun
            </>
          )}
        </button>

        <p className="text-[0.72rem] text-muted text-center mt-3 leading-relaxed">
          Belum punya akun?{' '}
          <Link
            href="/auth/register"
            className="text-g2 font-bold no-underline hover:underline"
          >
            Daftar sekarang gratis →
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
