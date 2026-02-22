import { createClient } from "@/lib/supabase";
import type { Campaign, CampaignRow } from "@/lib/database.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowToCampaign(row: CampaignRow & { clients?: { name: string } | null }): Campaign {
  return {
    id: row.id,
    clientId: row.client_id,
    clientName: row.clients?.name ?? "",
    name: row.name,
    status: row.status,
    type: row.type,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    budget: row.budget,
    spent: row.spent,
    impressions: row.impressions,
    clicks: row.clicks,
    conversions: row.conversions,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Fetch all campaigns (agency view), joined with client name.
 */
export async function getCampaigns(): Promise<Campaign[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*, clients(name)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) =>
    rowToCampaign(row as CampaignRow & { clients: { name: string } | null })
  );
}

/**
 * Fetch campaigns for a specific client (client portal view).
 */
export async function getCampaignsByClientId(clientId: string): Promise<Campaign[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*, clients(name)")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) =>
    rowToCampaign(row as CampaignRow & { clients: { name: string } | null })
  );
}

/**
 * Create a new campaign.
 */
export async function createCampaign(
  input: Omit<Campaign, "id" | "clientName">
): Promise<Campaign> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      client_id: input.clientId,
      name: input.name,
      status: input.status,
      type: input.type,
      start_date: input.startDate,
      end_date: input.endDate ?? null,
      budget: input.budget,
      spent: input.spent,
      impressions: input.impressions,
      clicks: input.clicks,
      conversions: input.conversions,
    })
    .select("*, clients(name)")
    .single();

  if (error) throw new Error(error.message);
  return rowToCampaign(data as CampaignRow & { clients: { name: string } | null });
}

/**
 * Update campaign metrics (e.g. spent, impressions, clicks, conversions).
 */
export async function updateCampaign(
  id: string,
  input: Partial<Omit<Campaign, "id" | "clientId" | "clientName">>
): Promise<Campaign> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .update({
      ...(input.name !== undefined && { name: input.name }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.budget !== undefined && { budget: input.budget }),
      ...(input.spent !== undefined && { spent: input.spent }),
      ...(input.impressions !== undefined && { impressions: input.impressions }),
      ...(input.clicks !== undefined && { clicks: input.clicks }),
      ...(input.conversions !== undefined && { conversions: input.conversions }),
      ...(input.endDate !== undefined && { end_date: input.endDate }),
    })
    .eq("id", id)
    .select("*, clients(name)")
    .single();

  if (error) throw new Error(error.message);
  return rowToCampaign(data as CampaignRow & { clients: { name: string } | null });
}
