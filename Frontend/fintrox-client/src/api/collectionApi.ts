import api from './axiosConfig';

export interface Collection {
  id: number;
  collectionNumber: string;
  loanId: number;
  loanNumber: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  employeeId: number;
  employeeName: string;
  amount: number;
  paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE';
  paymentModeDetails: string;
  installmentNumber: number;
  isFullPayment: boolean;
  gpsLatitude: number;
  gpsLongitude: number;
  photoUrl: string;
  isVerified: boolean;
  receiptUrl: string;
  isReceiptGenerated: boolean;
  notes: string;
  outstandingBalanceAfter: number;
  createdAt: string;
}

export interface CreateCollectionRequest {
  loanId: number;
  customerId: number;
  amount: number;
  paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE';
  paymentModeDetails?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  photoUrl?: string;
  notes?: string;
}

export interface CollectionStats {
  todayCollection: number;
  totalCollections: number;
  averageCollection: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const collectionApi = {
  getAll: () => api.get<ApiResponse<Collection[]>>('/collections'),
  getById: (id: number) => api.get<ApiResponse<Collection>>(`/collections/${id}`),
  create: (data: CreateCollectionRequest) =>
    api.post<ApiResponse<Collection>>('/collections', data),
  getByLoan: (loanId: number) =>
    api.get<ApiResponse<Collection[]>>(`/collections/loan/${loanId}`),
  getByCustomer: (customerId: number) =>
    api.get<ApiResponse<Collection[]>>(`/collections/customer/${customerId}`),
  getByEmployee: (employeeId: number) =>
    api.get<ApiResponse<Collection[]>>(`/collections/employee/${employeeId}`),
  getToday: () => api.get<ApiResponse<Collection[]>>('/collections/today'),
  verify: (id: number) =>
    api.patch<ApiResponse<Collection>>(`/collections/${id}/verify`),
  generateReceipt: (id: number) =>
    api.patch<ApiResponse<Collection>>(`/collections/${id}/receipt`),
};

export default collectionApi;       