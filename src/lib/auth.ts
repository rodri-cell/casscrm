// Simple auth context and utilities
// In a real app, this would connect to a database

export type UserRole = "agency" | "client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  status: "active" | "inactive" | "prospect";
  joinedAt: string;
  campaigns: number;
  monthlyBudget: number;
}

export interface Campaign {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  status: "active" | "paused" | "completed" | "draft";
  type: "social" | "email" | "seo" | "ppc" | "content";
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

// Mock data for demo purposes
export const MOCK_USERS: User[] = [
  {
    id: "agency-1",
    name: "Carlos Martínez",
    email: "admin@agencia.com",
    role: "agency",
    company: "Marketing Pro Agency",
  },
  {
    id: "client-1",
    name: "Ana García",
    email: "ana@empresa.com",
    role: "client",
    company: "Empresa García S.L.",
  },
  {
    id: "client-2",
    name: "Roberto López",
    email: "roberto@tienda.com",
    role: "client",
    company: "Tienda Online López",
  },
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: "client-1",
    name: "Ana García",
    email: "ana@empresa.com",
    company: "Empresa García S.L.",
    phone: "+34 612 345 678",
    status: "active",
    joinedAt: "2024-01-15",
    campaigns: 3,
    monthlyBudget: 2500,
  },
  {
    id: "client-2",
    name: "Roberto López",
    email: "roberto@tienda.com",
    company: "Tienda Online López",
    phone: "+34 698 765 432",
    status: "active",
    joinedAt: "2024-03-20",
    campaigns: 2,
    monthlyBudget: 1800,
  },
  {
    id: "client-3",
    name: "María Fernández",
    email: "maria@restaurante.com",
    company: "Restaurante El Buen Sabor",
    phone: "+34 655 111 222",
    status: "prospect",
    joinedAt: "2024-06-01",
    campaigns: 0,
    monthlyBudget: 800,
  },
  {
    id: "client-4",
    name: "Pedro Sánchez",
    email: "pedro@consultoria.com",
    company: "Consultoría Sánchez",
    phone: "+34 677 333 444",
    status: "inactive",
    joinedAt: "2023-11-10",
    campaigns: 1,
    monthlyBudget: 0,
  },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-1",
    clientId: "client-1",
    clientName: "Empresa García S.L.",
    name: "Campaña Redes Sociales Q1",
    status: "active",
    type: "social",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    budget: 1500,
    spent: 980,
    impressions: 45200,
    clicks: 1230,
    conversions: 87,
  },
  {
    id: "camp-2",
    clientId: "client-1",
    clientName: "Empresa García S.L.",
    name: "SEO Posicionamiento Web",
    status: "active",
    type: "seo",
    startDate: "2025-01-01",
    budget: 800,
    spent: 520,
    impressions: 12000,
    clicks: 890,
    conversions: 45,
  },
  {
    id: "camp-3",
    clientId: "client-2",
    clientName: "Tienda Online López",
    name: "Google Ads Temporada",
    status: "active",
    type: "ppc",
    startDate: "2025-02-01",
    endDate: "2025-04-30",
    budget: 1200,
    spent: 650,
    impressions: 78900,
    clicks: 2340,
    conversions: 156,
  },
  {
    id: "camp-4",
    clientId: "client-2",
    clientName: "Tienda Online López",
    name: "Email Marketing Newsletter",
    status: "paused",
    type: "email",
    startDate: "2025-01-15",
    budget: 400,
    spent: 200,
    impressions: 5600,
    clicks: 340,
    conversions: 28,
  },
  {
    id: "camp-5",
    clientId: "client-1",
    clientName: "Empresa García S.L.",
    name: "Content Marketing Blog",
    status: "completed",
    type: "content",
    startDate: "2024-10-01",
    endDate: "2024-12-31",
    budget: 600,
    spent: 600,
    impressions: 23400,
    clicks: 1560,
    conversions: 92,
  },
];

export function getUserByEmail(email: string): User | undefined {
  return MOCK_USERS.find((u) => u.email === email);
}

export function getClientCampaigns(clientId: string): Campaign[] {
  return MOCK_CAMPAIGNS.filter((c) => c.clientId === clientId);
}
