// Copyright 2020 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

// See `TICK_INTERVAL` in group_call.rs in RingRTC
export const AUDIO_LEVEL_INTERVAL_MS = 200;

export const REQUESTED_VIDEO_WIDTH = 960;
export const REQUESTED_VIDEO_HEIGHT = 720;
export const REQUESTED_VIDEO_FRAMERATE = 30;

export const REQUESTED_GROUP_VIDEO_WIDTH = 640;
export const REQUESTED_GROUP_VIDEO_HEIGHT = 480;

export const REQUESTED_SCREEN_SHARE_WIDTH = 2880;
export const REQUESTED_SCREEN_SHARE_HEIGHT = 1800;
// 15fps is much nicer but takes up a lot more CPU.
// Screen share framerate can be adjusted at runtime via getters/setters below.
// Default to 15fps if not set by user. Higher FPS uses more CPU.
export type ScreenShareFramerate = 1 | 5 | 15 | 30 | 60 | 144 ;

const SCREEN_SHARE_FRAMERATE_STORAGE_KEY = 'calling.screenShare.fps';

export function getRequestedScreenShareFramerate(): ScreenShareFramerate {
  try {
    const raw = window.localStorage.getItem(SCREEN_SHARE_FRAMERATE_STORAGE_KEY);
    const parsed = raw == null ? undefined : Number(raw);
    if (parsed === 1 || parsed === 5 || parsed === 15 || parsed === 30 || parsed === 60 || parsed === 144) {
      return parsed;
    }
  } catch (_e) {
    // window/localStorage may be unavailable in some environments; fall back below
  }
  // Fallback default
  return 15;
}

export function setRequestedScreenShareFramerate(value: ScreenShareFramerate): void {
  try {
    window.localStorage.setItem(
      SCREEN_SHARE_FRAMERATE_STORAGE_KEY,
      String(value)
    );
  } catch (_e) {
    // ignore persistence errors
  }
}

export const MAX_FRAME_WIDTH = 2880;
export const MAX_FRAME_HEIGHT = 1800;
export const FRAME_BUFFER_SIZE = MAX_FRAME_WIDTH * MAX_FRAME_HEIGHT * 4;
