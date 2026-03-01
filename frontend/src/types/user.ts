export interface User {
  id: string;
  name: string;
  email: string;
  role: 'BUYER' | 'ADMIN';
  phone: string | null;
  address: string | null;
  createdAt: string;
}
