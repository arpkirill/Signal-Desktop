// Copyright 2025 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Input } from '../../components/Input';
import { Button, ButtonVariant } from '../../components/Button';
import { FunDefaultEnglishEmojiLocalizationProvider } from '../../components/fun/FunEmojiLocalizationProvider';
import { i18n } from '../sandboxedInit';

const { ProxyWindowProps } = window.Signal as any;

function ProxyApp() {
  const [value, setValue] = useState('');
  useEffect(() => {
    ProxyWindowProps.getProxyUrl().then((v: string) => setValue(v || ''));
  }, []);

  return (
    <div className="Preferences__scroll-area" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, userSelect: 'text' }}>
      <div style={{ fontWeight: 600 }}>Прокси URL</div>
      <div className="Preferences__description Preferences__description--medium">
        Пример: http://user:pass@host:3128 или socks5://127.0.0.1:1080
      </div>
      <div>
        <Input i18n={i18n} placeholder="http://host:port или socks5://host:port" value={value} onChange={setValue} />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button
          variant={ButtonVariant.Primary}
          onClick={async () => {
            await ProxyWindowProps.setProxyUrl(value);
            ProxyWindowProps.restartApp();
          }}
        >
          Применить и перезапустить
        </Button>
        <Button
          variant={ButtonVariant.Secondary}
          onClick={async () => {
            await ProxyWindowProps.setProxyUrl('');
            ProxyWindowProps.restartApp();
          }}
        >
          Очистить и перезапустить
        </Button>
      </div>
    </div>
  );
}

const app = document.getElementById('app');
if (!app) {
  throw new Error('No #app');
}

createRoot(app).render(
  <StrictMode>
    <FunDefaultEnglishEmojiLocalizationProvider>
      <ProxyApp />
    </FunDefaultEnglishEmojiLocalizationProvider>
  </StrictMode>
);
