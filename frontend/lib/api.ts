const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api`;

async function request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

/* =====================================================
   TYPES
   ===================================================== */

export interface State {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
}

export interface Block {
  id: string;
  name: string;
}

export interface Village {
  id: string;
  name: string;
}

/* =====================================================
   STATES
   GET /api/states
   ===================================================== */

export async function getStates(): Promise<State[]> {
  return request<State[]>("/states");
}

/* =====================================================
   DISTRICTS
   GET /api/districts?stateId=...
   ===================================================== */

export async function getDistricts(
  stateId: string,
): Promise<District[]> {
  return request<District[]>(
    `/districts?stateId=${encodeURIComponent(stateId)}`,
  );
}

/* =====================================================
   BLOCKS
   GET /api/districts/:districtId/blocks
   ===================================================== */

export async function getBlocks(
  districtId: string,
): Promise<Block[]> {
  return request<Block[]>(
    `/districts/${encodeURIComponent(districtId)}/blocks`,
  );
}

/* =====================================================
   VILLAGES
   GET /api/blocks/:blockId/villages
   ===================================================== */

export async function getVillages(
  blockId: string,
): Promise<Village[]> {
  return request<Village[]>(
    `/blocks/${encodeURIComponent(blockId)}/villages`,
  );
}