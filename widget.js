(function () {
  'use strict';

  // ─── Guard: не инициализировать дважды ───────────────────────────────────
  if (window.__ciMsuWidgetLoaded) return;
  window.__ciMsuWidgetLoaded = true;

  // ─── Конфигурация ────────────────────────────────────────────────────────
  var WEBHOOK_URL =
    'https://ai-konfu-u70272.vm.elestio.app/webhook/3ea94e41-a168-4186-88f6-e731ca6544b3/chat';
  var SESSION_ID = 'session_' + Math.random().toString(36).substr(2, 9);

  // ─── Стили (все классы с префиксом cimsu-, scope через #cimsu-widget) ────
  var css = [
    '#cimsu-widget *{box-sizing:border-box;margin:0;padding:0;}',
    '#cimsu-widget{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;position:fixed;bottom:20px;right:20px;z-index:2147483647;}',

    /* Кнопка открытия */
    '#cimsu-toggle{width:60px;height:60px;background:#3CA342;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,.2);transition:transform .3s;}',
    '#cimsu-toggle:hover{transform:scale(1.08);}',
    '#cimsu-toggle svg{width:30px;fill:white;}',

    /* Контейнер чата */
    '#cimsu-container{position:absolute;bottom:70px;right:0;width:350px;height:500px;background:white;border-radius:20px;display:none;flex-direction:column;box-shadow:0 10px 30px rgba(33,64,115,.2);overflow:hidden;}',

    /* Шапка */
    '#cimsu-header{background:linear-gradient(90deg,#214073 0%,#3CA342 100%);color:white;padding:12px 20px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}',
    '#cimsu-header-title{font-weight:bold;font-size:16px;}',
    '#cimsu-header-sub{font-size:12px;opacity:.9;}',
    '#cimsu-close{cursor:pointer;font-size:24px;line-height:1;background:none;border:none;color:white;padding:0;}',

    /* Лента сообщений */
    '#cimsu-messages{flex:1;padding:15px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;background:#f9f9f9;}',

    /* Пузыри */
    '.cimsu-msg{padding:10px 14px;border-radius:15px;max-width:85%;font-size:14px;line-height:1.5;word-wrap:break-word;white-space:pre-wrap;}',
    '.cimsu-bot{background:white;align-self:flex-start;border:1px solid #eee;color:#333;}',
    '.cimsu-user{background:#3CA342;color:white;align-self:flex-end;}',
    '.cimsu-bot a{color:#214073;text-decoration:underline;}',

    /* Индикатор печати */
    '.cimsu-typing{display:flex!important;gap:4px;padding:12px 14px!important;align-items:center;}',
    '.cimsu-dot{width:6px;height:6px;background:#ccc;border-radius:50%;animation:cimsuBlink 1.4s infinite both;}',
    '.cimsu-dot:nth-child(2){animation-delay:.2s;}',
    '.cimsu-dot:nth-child(3){animation-delay:.4s;}',
    '@keyframes cimsuBlink{0%,80%,100%{opacity:0}40%{opacity:1}}',

    /* Поле ввода */
    '#cimsu-input-area{padding:10px;display:flex;gap:8px;border-top:1px solid #eee;background:white;flex-shrink:0;}',
    '#cimsu-input{flex:1;border:1px solid #eee;border-radius:20px;padding:10px 15px;outline:none;font-size:14px;font-family:inherit;}',
    '#cimsu-input:focus{border-color:#3CA342;}',
    '#cimsu-send{background:#3CA342;border:none;width:40px;height:40px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.2s;flex-shrink:0;}',
    '#cimsu-send:hover{background:#348F3A;}',
    '#cimsu-send svg{width:20px;fill:white;}',

    /* Мобильная адаптация */
    '@media(max-width:400px){#cimsu-container{width:calc(100vw - 24px);right:-8px;}}',
  ].join('');

  // ─── HTML ─────────────────────────────────────────────────────────────────
  var html = [
    '<div id="cimsu-toggle" role="button" aria-label="Открыть чат с ИИ-помощником">',
      '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>',
    '</div>',
    '<div id="cimsu-container" role="dialog" aria-label="Чат с ИИ-помощником">',
      '<div id="cimsu-header">',
        '<div>',
          '<div id="cimsu-header-title">ИИ-помощник ИК МГУ</div>',
          '<div id="cimsu-header-sub">На связи 24/7</div>',
        '</div>',
        '<button id="cimsu-close" aria-label="Закрыть чат">&times;</button>',
      '</div>',
      '<div id="cimsu-messages" aria-live="polite"></div>',
      '<div id="cimsu-input-area">',
        '<input id="cimsu-input" type="text" placeholder="Напишите ваш вопрос..." autocomplete="off" aria-label="Поле ввода сообщения">',
        '<button id="cimsu-send" aria-label="Отправить">',
          '<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
        '</button>',
      '</div>',
    '</div>',
  ].join('');

  // ─── Монтирование в DOM ───────────────────────────────────────────────────
  function mount() {
    // Стили
    var styleEl = document.createElement('style');
    styleEl.id = 'cimsu-styles';
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // Разметка
    var wrapEl = document.createElement('div');
    wrapEl.id = 'cimsu-widget';
    wrapEl.innerHTML = html;
    document.body.appendChild(wrapEl);

    // Ссылки на элементы
    var toggle    = document.getElementById('cimsu-toggle');
    var container = document.getElementById('cimsu-container');
    var closeBtn  = document.getElementById('cimsu-close');
    var messages  = document.getElementById('cimsu-messages');
    var input     = document.getElementById('cimsu-input');
    var sendBtn   = document.getElementById('cimsu-send');

    // ── Открытие / закрытие ──────────────────────────────────────────────
    var isOpen = false;
    function openChat() {
      container.style.display = 'flex';
      isOpen = true;
      input.focus();
    }
    function closeChat() {
      container.style.display = 'none';
      isOpen = false;
    }
    toggle.addEventListener('click', function () { isOpen ? closeChat() : openChat(); });
    closeBtn.addEventListener('click', closeChat);

    // Закрытие по Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeChat();
    });

    // ── Добавление сообщения ─────────────────────────────────────────────
    function addMessage(text, sender, isTyping) {
      var div = document.createElement('div');
      div.className = 'cimsu-msg cimsu-' + sender + (isTyping ? ' cimsu-typing' : '');

      if (isTyping) {
        div.innerHTML =
          '<div class="cimsu-dot"></div>' +
          '<div class="cimsu-dot"></div>' +
          '<div class="cimsu-dot"></div>';
        div.id = 'cimsu-typing-indicator';
      } else {
        // Markdown-light: **жирный**, ссылки уже в тексте как HTML
        var formatted = text
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          // Безопасный рендер готовых <a>-тегов из ответа бота
          .replace(/&lt;a /g, '<a ').replace(/&lt;\/a&gt;/g, '</a>');
        div.innerHTML = formatted;
      }

      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
      return div;
    }

    // ── Приветствие ──────────────────────────────────────────────────────
    addMessage(
      'Нихао! 👋 Я помогу вам подобрать курс китайского или сориентироваться в расписании.',
      'bot'
    );
    addMessage(
      'Кстати, для мобильного доступа и уведомлений используйте наш **Telegram-бот**: ' +
      '<a href="https://t.me/ci_msu_bot" target="_blank" rel="noopener">@ci_msu_bot</a> 🐉',
      'bot'
    );

    // ── Отправка сообщения ───────────────────────────────────────────────
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
        // credentials: 'omit' — по умолчанию, куки не отправляются (важно для CORS)
        body: JSON.stringify({ chatInput: text, sessionId: SESSION_ID }),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (data) {
          var botText =
            data.output ||
            data.response ||
            'Произошла небольшая ошибка. Попробуйте ещё раз.';
          typingEl.remove();
          addMessage(botText, 'bot');
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

  // ─── Запуск после загрузки DOM ───────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
