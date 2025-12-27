import { API_BASE_URL } from '../config';

export interface Lead {
    id: number;
    student_id: number;
    country: string;
    status: string;
    created_at: string;
    student: {
        id: number;
        name: string;
        whatsapp_id: string;
        email: string;
        profile_data: any;
    };
}

export async function fetchLeadHistory(studentId: number) {
    const res = await fetch(`${API_BASE_URL}/leads/${studentId}/history`);
    if (!res.ok) throw new Error("Failed to fetch history");
    return res.json();
}

export const fetchLeads = async (): Promise<Lead[]> => {
    const response = await fetch(`${API_BASE_URL}/leads/`);
    if (!response.ok) throw new Error('Failed to fetch leads');
    return response.json();
};

export const updateLeadStatus = async (id: number, status: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update status');
    return response.json();
};
