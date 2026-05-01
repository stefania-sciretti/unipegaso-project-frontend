export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  goal?: string;
  createdAt: string;
}

export interface ClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  birthDate?: string | null;
  goal?: string | null;
}
