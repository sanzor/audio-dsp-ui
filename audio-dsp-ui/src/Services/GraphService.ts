
import type { Graph } from "@/Domain/Graph";
import type { TrackRegionSet } from "@/Domain/TrackRegionSet";
import type { CreateGraphParams } from "@/Dtos/Graphs/CreateGraphParams";
import type { CreateGraphResult } from "@/Dtos/Graphs/CreateGraphResult";
import type { EditGraphResult } from "@/Dtos/Graphs/EditGraphResult";
import type { RemoveGraphParams } from "@/Dtos/Graphs/RemoveGraphParams";
import type { EditGraphParams } from "@/Dtos/Regions/EditRegionParams";
import type { CopyRegionSetParams } from "@/Dtos/RegionSets/CoyRegionSetParams";
import type { CreateRegionSetParams } from "@/Dtos/RegionSets/CreateRegionSetParams";
import type { CreateRegionSetResult } from "@/Dtos/RegionSets/CreateRegionSetResult";
import type { EditRegionSetParams } from "@/Dtos/RegionSets/EditRegionSetParams";
import type { EditRegionSetResult } from "@/Dtos/RegionSets/EditRegionSetResult";
import type { GetRegionSetsForTrackResult } from "@/Dtos/RegionSets/GetRegionSetsForTrackResult";
import type { GetRegionSetsResult } from "@/Dtos/RegionSets/GetRegionSetsResult";
import type { RemoveRegionSetParams } from "@/Dtos/RegionSets/RemoveRegionSetParams";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiGetGraph(graphId:string):Promise<Graph>{
    const res = await fetch(`${BASE_URL}/graphs/get-graph?graph_id=${graphId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to fetch session');

  const json = await res.json(); // ✅ await here
  console.log(json);
  return json.tracks;
}




export async function apiCreateGraph(params: CreateGraphParams): Promise<CreateGraphResult> {
  console.log("a");
  const res = await fetch(`${BASE_URL}/graphs/create`, {
    method: 'POST', // ✅ must be POST to send body
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  console.log(res.status);
  if (!res.ok) {
    throw new Error(`Failed to create graph: ${res.statusText}`);
  }
  return await res.json();
}

export async function apiUpdateGraph(params: EditGraphParams): Promise<EditGraphResult> {
  console.log("a");
  const res = await fetch(`${BASE_URL}/graphs/edit`, {
    method: 'PATCH', // ✅ must be POST to send body
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  console.log(res.status);
  if (!res.ok) {
    throw new Error(`Failed to update graph: ${res.statusText}`);
  }
  return await res.json();
}

export async function apiRemoveGraph(params: RemoveGraphParams): Promise<void> {
  const res = await fetch(`${BASE_URL}/region-sets/remove?region_set_id=${params.graph_id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!res.ok) throw new Error('Refresh token failed');
}

export async function apiCopyGraph(params: CopyRegionSetParams): Promise<CreateRegionSetResult> {
  console.log("a");
  const res = await fetch(`${BASE_URL}/region-sets/create`, {
    method: 'POST', // ✅ must be POST to send body
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  console.log(res.status);
  if (!res.ok) {
    throw new Error(`Failed to update track: ${res.statusText}`);
  }
  return await res.json();
}