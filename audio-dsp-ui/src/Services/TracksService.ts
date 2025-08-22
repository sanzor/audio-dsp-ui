// /auth/auth-service.ts

import type { GetTrackParams } from '@/Dtos/Tracks/GetTrackParams';

import type { GetTrackResult } from '@/Dtos/Tracks/GetTrackResult';
import type { UpdateTrackParams } from '@/Dtos/Tracks/UpdateTrackParams';
import type { UpdateTrackResult } from '@/Dtos/Tracks/UpdateTrackResult';
import type { TrackMeta } from '@/Domain/TrackMeta';
import type { CopyTrackParams } from '@/Dtos/Tracks/CopyTrackParams';
import type { CopyTrackResult } from '@/Dtos/Tracks/CopyTrackResult';
import type { GetTrackRawParams } from '@/Dtos/Tracks/GetTrackRawParams';
import type { GetTrackRawResult } from '@/Dtos/Tracks/GetTrackRawResult';
import type { AddTrackParams } from '@/Dtos/Tracks/AddTrackParams';
import type { AddTrackResult } from '@/Dtos/Tracks/AddTrackResult';
import type { RemoveTrackParams } from '@/Dtos/Tracks/RemoveTrackParams';
import type { RemoveTrackResult } from '@/Dtos/Tracks/RemoveTrackResult';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

/**
 * Fetches the current user session.
 */
export async function apiGetTracks(): Promise<TrackMeta[]> {
  const res = await fetch(`${BASE_URL}/tracks/`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to fetch session');
  return res.json();
}

export async function apiGetTrackMeta(params:GetTrackParams): Promise<GetTrackResult> {
  const res = await fetch(`${BASE_URL}/tracks/get-meta?track_id=${params.track_id}`, {
    method: 'GET',
    credentials: 'include'
  });

  if (!res.ok) throw new Error('Refresh token failed');
  return res.json();
}

export async function apiGetTrackInfo(params:GetTrackParams): Promise<GetTrackResult> {
  const res = await fetch(`${BASE_URL}/tracks/get-track-info?track_id=${params.track_id}`, {
    method: 'GET',
    credentials: 'include'
  });

  if (!res.ok) throw new Error('Refresh token failed');
  return res.json();
}

export async function apiGetTrackRaw(params:GetTrackRawParams): Promise<GetTrackRawResult> {
  const res = await fetch(`${BASE_URL}/tracks/get-meta?track_id=${params.track_id}`, {
    method: 'GET',
    credentials: 'include'
  });

  if (!res.ok) throw new Error('Refresh token failed');
  return res.json();
}

export async function apiAddTrack(params:AddTrackParams): Promise<AddTrackResult> {
  const res = await fetch(`${BASE_URL}/tracks/add-track`, {
    method: 'POST', // ✅ must be POST to send body
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params.rawTrack),
  });

  if (!res.ok) {
    throw new Error(`Failed to update track: ${res.statusText}`);
  }

  return res.json();
}

export async function apiRemoveTrack(params:RemoveTrackParams): Promise<RemoveTrackResult> {
  const res = await fetch(`${BASE_URL}/tracks/get-meta?track_id=${params.trackId}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!res.ok) throw new Error('Refresh token failed');
  return res.json();
}

export async function apiUpdateTrack(params: UpdateTrackParams): Promise<UpdateTrackResult> {
  const res = await fetch(`${BASE_URL}/tracks/update-track-info`, {
    method: 'POST', // ✅ must be POST to send body
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Failed to update track: ${res.statusText}`);
  }
  return res.json();
}

export async function apiCopyTrack(params: CopyTrackParams): Promise<CopyTrackResult> {
  const res = await fetch(`${BASE_URL}/tracks/copy-track`, {
    method: 'POST', // ✅ must be POST to send body
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Failed to update track: ${res.statusText}`);
  }
  return res.json();
}

