// ══ Status Order ══
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Menunggu Bayar',
  CONFIRMED: 'Dikonfirmasi',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  DONE: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  PROCESSING: 'blue',
  SHIPPED: 'orange',
  DONE: 'green',
  CANCELLED: 'red',
};

// ══ Buyer Type ══
export const BUYER_TYPE_LABELS: Record<string, string> = {
  CONSUMER: 'Konsumen',
  RESELLER: 'Reseller',
};

// ══ Months ══
export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

// ══ App Info ══
export const APP_NAME = 'BuahKita';
export const APP_TAGLINE = 'Segar dari Kebun';
