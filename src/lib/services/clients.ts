import { createClient } from "@/lib/supabase";
import type { Client, ClientRow } from "@/lib/database.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowToClient(row: ClientRow, campaignCount = 0): Client {
  return {
    id: row.id,
    profileId: row.profile_id,
    name: row.name,
    email: row.email,
    company: row.company,
    phone: row.phone ?? undefined,
    status: row.status,
    joinedAt: row.joined_at,
    campaigns: campaignCount,
    monthlyBudget: row.monthly_budget,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Fetch all clients (agency view).
 * Includes a campaign count via a Supabase aggregate.
 */
export async function getClients(): Promise<Client[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*, campaigns(count)")
    .order("joined_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    // Supabase returns count as [{ count: number }]
    const count = Array.isArray(row.campaigns)
      ? (row.campaigns[0] as { count: number })?.count ?? 0
      : 0;
    return rowToClient(row as ClientRow, count);
  });
}

/**
 * Fetch a single client by their profile_id (used in client portal).
 */
export async function getClientByProfileId(profileId: string): Promise<Client | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*, campaigns(count)")
    .eq("profile_id", profileId)
    .single();

  if (error) return null;
  if (!data) return null;

  const count = Array.isArray(data.campaigns)
    ? (data.campaigns[0] as { count: number })?.count ?? 0
    : 0;

  return rowToClient(data as ClientRow, count);
}

/**
 * Create a new client.
 */
export async function createClient(
  input: Omit<Client, "id" | "campaigns">
): Promise<Client> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .insert({
      name: input.name,
      email: input.email,
      company: input.company,
      phone: input.phone ?? null,
      status: input.status,
      monthly_budget: input.monthlyBudget,
      joined_at: input.joinedAt,
      profile_id: input.profileId ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToClient(data as ClientRow);
}

/**
 * Update a client.
 */
export async function updateClient(
  id: string,
  input: Partial<Omit<Client, "id" | "campaigns">>
): Promise<Client> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .update({
      ...(input.name !== undefined && { name: input.name }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.company !== undefined && { company: input.company }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.monthlyBudget !== undefined && { monthly_budget: input.monthlyBudget }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToClient(data as ClientRow);
}
