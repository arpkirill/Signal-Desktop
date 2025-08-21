// Copyright 2025
// SPDX-License-Identifier: AGPL-3.0-only

import { contextBridge, ipcRenderer } from 'electron';
import { MinimalSignalContext } from '../minimalContext';

async function getProxyUrl(): Promise<string> {
  const value = await ipcRenderer.invoke('settings:get:proxyUrl');
  return typeof value === 'string' ? value : '';
}

async function setProxyUrl(value: string): Promise<void> {
  await ipcRenderer.invoke('settings:set:proxyUrl', value);
}

function restartApp(): void {
  ipcRenderer.send('restart');
}

const Signal = {
  ProxyWindowProps: {
    getProxyUrl,
    setProxyUrl,
    restartApp,
  },
};

contextBridge.exposeInMainWorld('Signal', Signal);
contextBridge.exposeInMainWorld('SignalContext', MinimalSignalContext);
