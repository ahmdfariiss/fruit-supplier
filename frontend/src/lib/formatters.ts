// Cached formatter instances — avoid creating new ones on every call
const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * Format angka ke format Rupiah
 */
export const formatRupiah = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return rupiahFormatter.format(num);
};

/**
 * Format tanggal ke bahasa Indonesia
 */
export const formatDate = (date: string | Date): string => {
  return dateFormatter.format(new Date(date));
};

/**
 * Format tanggal dengan waktu
 */
export const formatDateTime = (date: string | Date): string => {
  return dateTimeFormatter.format(new Date(date));
};
