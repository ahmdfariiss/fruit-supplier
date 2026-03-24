/**
 * Format angka ke format Rupiah
 */
const JAKARTA_TIMEZONE = 'Asia/Jakarta';

export const formatRupiah = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format tanggal ke bahasa Indonesia
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: JAKARTA_TIMEZONE,
  }).format(new Date(date));
};

/**
 * Format tanggal dengan waktu
 */
export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: JAKARTA_TIMEZONE,
  }).format(new Date(date));
};

/**
 * Bulan saat ini (1-12) dalam timezone Jakarta
 */
export const getJakartaCurrentMonth = (): number => {
  return Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: JAKARTA_TIMEZONE,
      month: 'numeric',
    }).format(new Date()),
  );
};

/**
 * Tahun saat ini dalam timezone Jakarta
 */
export const getJakartaCurrentYear = (): number => {
  return Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: JAKARTA_TIMEZONE,
      year: 'numeric',
    }).format(new Date()),
  );
};

/**
 * Tanggal (day of month) saat ini (1-31) dalam timezone Jakarta
 */
export const getJakartaCurrentDate = (): number => {
  return Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: JAKARTA_TIMEZONE,
      day: 'numeric',
    }).format(new Date()),
  );
};
