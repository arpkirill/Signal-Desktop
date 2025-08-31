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

export const SCREEN_SHARE_FPS_CHANGED_EVENT = 'calling:screenShareFpsChanged';
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
  // Notify listeners (e.g., live capturers) to apply without restart
  try {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent(SCREEN_SHARE_FPS_CHANGED_EVENT, { detail: value }));
    }
  } catch (_e) {
    // ignore event dispatch errors
  }
}

export const MAX_FRAME_WIDTH = 2880;
export const MAX_FRAME_HEIGHT = 1800;
export const FRAME_BUFFER_SIZE = MAX_FRAME_WIDTH * MAX_FRAME_HEIGHT * 4;

// Screen share quality presets
export type ScreenShareQuality =
  | '144p'
  | '240p'
  | '360p'
  | '480p'
  | '720p'
  | '1080p'
  | '1440p'
  | '2160p'
  | '4320p';

export const SCREEN_SHARE_QUALITY_CHANGED_EVENT = 'calling:screenShareQualityChanged';
const SCREEN_SHARE_QUALITY_STORAGE_KEY = 'calling.screenShare.quality';

export const SCREEN_SHARE_QUALITIES: ReadonlyArray<ScreenShareQuality> = [
  '144p',
  '240p',
  '360p',
  '480p',
  '720p',
  '1080p',
  '1440p',
  '2160p',
  '4320p',
];

export function getRequestedScreenShareQuality(): ScreenShareQuality {
  try {
    const raw = window.localStorage.getItem(SCREEN_SHARE_QUALITY_STORAGE_KEY);
    const value = (raw ?? '') as ScreenShareQuality;
    if (SCREEN_SHARE_QUALITIES.includes(value)) {
      return value;
    }
  } catch (_e) {
    // ignore, fall back below
  }
  return '720p';
}

export function setRequestedScreenShareQuality(value: ScreenShareQuality): void {
  try {
    window.localStorage.setItem(SCREEN_SHARE_QUALITY_STORAGE_KEY, value);
  } catch (_e) {
    // ignore persistence errors
  }
  // Notify listeners to apply without restart
  try {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent(SCREEN_SHARE_QUALITY_CHANGED_EVENT, { detail: value }));
    }
  } catch (_e) {
    // ignore event dispatch errors
  }
}

// Map quality label to width/height (16:9 common presets)
export function getScreenShareDimensionsForQuality(q: ScreenShareQuality): { width: number; height: number } {
  switch (q) {
    case '144p':
      return { width: 256, height: 144 };
    case '240p':
      return { width: 426, height: 240 };
    case '360p':
      return { width: 640, height: 360 };
    case '480p':
      return { width: 854, height: 480 };
    case '720p':
      return { width: 1280, height: 720 };
    case '1080p':
      return { width: 1920, height: 1080 };
    case '1440p':
      return { width: 2560, height: 1440 };
    case '2160p':
      return { width: 3840, height: 2160 };
    case '4320p':
      return { width: 7680, height: 4320 };
    default:
      return { width: REQUESTED_SCREEN_SHARE_WIDTH, height: REQUESTED_SCREEN_SHARE_HEIGHT };
  }
}

export function getRequestedScreenShareDimensions(): { width: number; height: number } {
  return getScreenShareDimensionsForQuality(getRequestedScreenShareQuality());
}
