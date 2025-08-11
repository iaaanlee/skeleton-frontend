import { axiosHttpClient } from '../common/axiosHttpClient';

export type Prescription = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  fileCount: number;
  status: 'completed' | 'processing' | 'failed';
};

export type PrescriptionHistoryResponse = {
  prescriptions: Prescription[];
  total: number;
};

class PrescriptionService {
  async getPrescriptionHistory(accountId: string, profileId: string): Promise<PrescriptionHistoryResponse> {
    const { data } = await axiosHttpClient.request<{ success: boolean; data: PrescriptionHistoryResponse }>({
      method: 'GET',
      url: '/prescriptions/history',
      params: { accountId, profileId }
    });
    return data.data;
  }

  async getPrescriptionById(prescriptionId: string): Promise<Prescription> {
    const { data } = await axiosHttpClient.request<{ success: boolean; data: Prescription }>({
      method: 'GET',
      url: `/prescriptions/${prescriptionId}`
    });
    return data.data;
  }
}

export const prescriptionService = new PrescriptionService();
