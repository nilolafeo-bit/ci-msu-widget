(function () {
  'use strict';

  if (window.__ciMsuWidgetLoaded) return;
  window.__ciMsuWidgetLoaded = true;

  var WEBHOOK_URL =
    'https://ai-konfu-u70272.vm.elestio.app/webhook/3ea94e41-a168-4186-88f6-e731ca6544b3/chat';
  var SESSION_ID = 'session_' + Math.random().toString(36).substr(2, 9);

  var css = [
    /* Сброс только внутри виджета */
    '#cimsu-widget, #cimsu-widget * {',
      'box-sizing: border-box;',
      'margin: 0;',
      'padding: 0;',
      'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
      'line-height: 1.5;',
    '}',

    '#cimsu-widget {',
      'position: fixed;',
      'bottom: 20px;',
      'right: 20px;',
      'z-index: 2147483647;',
    '}',

    /* Кнопка открытия */
    '#cimsu-toggle {',
      'width: 60px;',
      'height: 60px;',
      'background: #3CA342;',
      'border-radius: 50%;',
      'display: flex;',
      'align-items: center;',
      'justify-content: center;',
      'cursor: pointer;',
      'box-shadow: 0 4px 15px rgba(0,0,0,0.25);',
      'transition: transform 0.2s, box-shadow 0.2s;',
      'border: none;',
      'outline: none;',
    '}',
    '#cimsu-toggle:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }',
    '#cimsu-toggle svg { width: 28px; height: 28px; fill: white; display: block; }',

    /* Контейнер чата */
    '#cimsu-container {',
      'position: absolute;',
      'bottom: 70px;',
      'right: 0;',
      'width: 360px;',
      'height: 520px;',
      'max-height: calc(100vh - 100px);',
      'background: #fff;',
      'border-radius: 20px;',
      'display: none;',
      'flex-direction: column;',
      'box-shadow: 0 12px 40px rgba(33,64,115,0.22);',
      'overflow: hidden;',
    '}',

    /* Шапка */
    '#cimsu-header {',
      'background: linear-gradient(90deg, #214073 0%, #3CA342 100%);',
      'color: #fff;',
      'padding: 14px 18px;',
      'display: flex;',
      'justify-content: space-between;',
      'align-items: center;',
      'flex-shrink: 0;',
      'gap: 8px;',
    '}',
    '#cimsu-header-info { min-width: 0; }',
    '#cimsu-header-title { font-weight: 700; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    '#cimsu-header-sub   { font-size: 12px; opacity: 0.85; margin-top: 1px; }',
    '#cimsu-close {',
      'cursor: pointer;',
      'font-size: 26px;',
      'line-height: 1;',
      'background: none;',
      'border: none;',
      'color: #fff;',
      'opacity: 0.8;',
      'padding: 0;',
      'flex-shrink: 0;',
      'width: 28px;',
      'height: 28px;',
      'display: flex;',
      'align-items: center;',
      'justify-content: center;',
    '}',
    '#cimsu-close:hover { opacity: 1; }',

    /* Лента сообщений */
    '#cimsu-messages {',
      'flex: 1;',
      'padding: 14px 12px;',
      'overflow-y: auto;',
      'overflow-x: hidden;',
      'display: flex;',
      'flex-direction: column;',
      'gap: 8px;',
      'background: #f7f8fa;',
      'min-height: 0;',
    '}',

    /* Пузыри */
    '.cimsu-msg {',
      'padding: 14px 20px;',
      'border-radius: 16px;',
      'max-width: 78%;',          /* чуть уже — даёт воздух по бокам */
      'width: fit-content;',      /* пузырь не растягивается шире текста */
      'font-size: 14px;',
      'line-height: 1.55;',
      'word-break: break-word;',
      'overflow-wrap: break-word;',
      'white-space: pre-wrap;',
      'hyphens: auto;',
    '}',
    '.cimsu-bot {',
      'background: #fff;',
      'align-self: flex-start;',
      'border: 1px solid #e8e8e8;',
      'color: #222;',
      'border-radius: 4px 16px 16px 16px;',
      'margin-right: 10px;',      /* отступ от правого края */
    '}',
    '.cimsu-user {',
      'background: #3CA342;',
      'color: #fff;',
      'align-self: flex-end;',
      'border-radius: 16px 4px 16px 16px;',
      'margin-left: 10px;',       /* отступ от левого края */
    '}',
    '.cimsu-bot a { color: #214073; text-decoration: underline; word-break: break-all; }',
    '.cimsu-bot strong { font-weight: 600; }',

    /* Индикатор печати */
    '.cimsu-typing { display: flex !important; gap: 5px; padding: 12px 14px !important; align-items: center; min-height: 42px; }',
    '.cimsu-dot { width: 7px; height: 7px; background: #bbb; border-radius: 50%; animation: cimsuBlink 1.4s infinite both; flex-shrink: 0; }',
    '.cimsu-dot:nth-child(2) { animation-delay: 0.2s; }',
    '.cimsu-dot:nth-child(3) { animation-delay: 0.4s; }',
    '@keyframes cimsuBlink { 0%,80%,100%{opacity:0} 40%{opacity:1} }',

    /* Поле ввода */
    '#cimsu-input-area {',
      'padding: 10px 12px;',
      'display: flex;',
      'gap: 8px;',
      'align-items: center;',
      'border-top: 1px solid #eee;',
      'background: #fff;',
      'flex-shrink: 0;',
    '}',
    '#cimsu-input {',
      'flex: 1;',
      'min-width: 0;',
      'border: 1.5px solid #e0e0e0;',
      'border-radius: 20px;',
      'padding: 9px 14px;',
      'outline: none;',
      'font-size: 14px;',
      'font-family: inherit;',
      'background: #f7f8fa;',
      'transition: border-color 0.2s;',
      'color: #222;',
    '}',
    '#cimsu-input:focus { border-color: #3CA342; background: #fff; }',
    '#cimsu-input::placeholder { color: #aaa; }',
    '#cimsu-send {',
      'background: #3CA342;',
      'border: none;',
      'width: 40px;',
      'height: 40px;',
      'border-radius: 50%;',
      'cursor: pointer;',
      'display: flex;',
      'align-items: center;',
      'justify-content: center;',
      'flex-shrink: 0;',
      'transition: background 0.2s, transform 0.15s;',
      'outline: none;',
    '}',
    '#cimsu-send:hover:not(:disabled) { background: #348F3A; transform: scale(1.05); }',
    '#cimsu-send:disabled { background: #a5d6a7; cursor: not-allowed; }',
    '#cimsu-send svg { width: 18px; height: 18px; fill: #fff; display: block; }',

    /* Мобильная адаптация */
    '@media (max-width: 420px) {',
      '#cimsu-widget { bottom: 16px; right: 12px; }',
      '#cimsu-container {',
        'width: calc(100vw - 24px);',
        'height: calc(100dvh - 100px);',
        'max-height: calc(100dvh - 100px);',
        'right: -4px;',
      '}',
      '.cimsu-msg { max-width: 88%; font-size: 13px; }',
      '#cimsu-input { font-size: 16px; }',
    '}',
  ].join('\n');

  var html = [
    '<button id="cimsu-toggle" aria-label="Открыть чат с ИИ-помощником">',
      '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>',
    '</button>',
    '<div id="cimsu-container" role="dialog" aria-modal="true" aria-label="Чат с ИИ-помощником">',
      '<div id="cimsu-header">',
        '<div id="cimsu-header-info">',
          '<div id="cimsu-header-title">ИИ-помощник ИК МГУ</div>',
          '<div id="cimsu-header-sub">На связи 24/7</div>',
        '</div>',
        '<button id="cimsu-close" aria-label="Закрыть чат">&times;</button>',
      '</div>',
      '<div id="cimsu-messages" aria-live="polite" aria-atomic="false"></div>',
      '<div id="cimsu-input-area">',
        '<input id="cimsu-input" type="text" placeholder="Напишите ваш вопрос…"',
               ' autocomplete="off" autocorrect="off" spellcheck="true"',
               ' aria-label="Поле ввода сообщения" enterkeyhint="send">',
        '<button id="cimsu-send" aria-label="Отправить">',
          '<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
        '</button>',
      '</div>',
    '</div>',
  ].join('');

  function mount() {
    var styleEl = document.createElement('style');
    styleEl.id = 'cimsu-styles';
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    var root = document.createElement('div');
    root.id = 'cimsu-widget';
    root.innerHTML = html;
    document.body.appendChild(root);

    var toggle    = document.getElementById('cimsu-toggle');
    var container = document.getElementById('cimsu-container');
    var closeBtn  = document.getElementById('cimsu-close');
    var messages  = document.getElementById('cimsu-messages');
    var input     = document.getElementById('cimsu-input');
    var sendBtn   = document.getElementById('cimsu-send');

    var isOpen = false;

    function openChat() {
      container.style.display = 'flex';
      isOpen = true;
      setTimeout(function () { input.focus(); }, 50);
    }
    function closeChat() {
      container.style.display = 'none';
      isOpen = false;
    }

    toggle.addEventListener('click', function () { isOpen ? closeChat() : openChat(); });
    closeBtn.addEventListener('click', closeChat);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeChat();
    });

    // raw=true → доверенный HTML (приветствия, ответы n8n); raw=false → пользовательский ввод
    function addMessage(text, sender, isTyping, raw) {
      var div = document.createElement('div');
      div.className = 'cimsu-msg cimsu-' + sender + (isTyping ? ' cimsu-typing' : '');

      if (isTyping) {
        div.innerHTML =
          '<div class="cimsu-dot"></div>' +
          '<div class="cimsu-dot"></div>' +
          '<div class="cimsu-dot"></div>';
        div.id = 'cimsu-typing-indicator';
      } else if (raw) {
        // Доверенный HTML: только **жирный** → <strong>, ссылки уже готовые
        div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      } else {
        // Пользовательский ввод — полное экранирование
        div.innerHTML = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }

      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
      return div;
    }

    addMessage(
      'Нихао! 👋 Я помогу вам подобрать курс китайского или сориентироваться в расписании.',
      'bot', false, true
    );
    addMessage(
      'Для мобильного доступа и уведомлений используйте наш **Telegram-бот**: ' +
      '<a href="https://t.me/ci_msu_bot" target="_blank" rel="noopener">@ci_msu_bot</a> 🐉',
      'bot', false, true
    );

    var isSending = false;

    function sendMessage() {
      if (isSending) return;
      var text = input.value.trim();
      if (!text) return;

      addMessage(text, 'user');
      input.value = '';
      isSending = true;
      sendBtn.disabled = true;

      var typingEl = addMessage('', 'bot', true);

      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatInput: text, sessionId: SESSION_ID }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) {
          var botText = data.output || data.response ||
            'Произошла небольшая ошибка. Попробуйте ещё раз.';
          typingEl.remove();
          addMessage(botText, 'bot', false, true);
        })
        .catch(function () {
          typingEl.remove();
          addMessage(
            'Ошибка связи. Пожалуйста, проверьте интернет или попробуйте позже.',
            'bot'
          );
        })
        .finally(function () {
          isSending = false;
          sendBtn.disabled = false;
          input.focus();
        });
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') sendMessage();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
