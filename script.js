/* =====================================================================
   1. ГЛАВНЫЕ НАСТРОЙКИ — меняй тут
   ===================================================================== */
const CONFIG = {
  signature: '— Ксюша ♥',         // подпись в самом низу финальной страницы

  // Ответ уходит тебе ТИХО: она просто нажимает кнопку — и попадает на страницу с мемами.
  email: 'maslovskayaksenya228@gmail.com', // сюда приходит письмо с ответом (сервис FormSubmit, бесплатно, без регистрации)

  // По желанию — ещё и тебе в Telegram личным сообщением от бота (она этого не видит).
  // Это самый надёжный канал: доходит мгновенно. Настраивается один раз:
  //   1) в Telegram у @BotFather: /newbot → придумай имя → получишь токен вида 123456789:AA...
  //   2) напиши своему новому боту любое сообщение (первым он писать не умеет)
  //   3) открой в браузере https://api.telegram.org/bot<ТОКЕН>/getUpdates и найди "chat":{"id":ЧИСЛО}
  // Пока botToken пусто — ответ идёт только на почту.
  botToken: '',                     // токен бота
  chatId: '',                       // твой chat_id

  // Финальная страница с мемами — открывается после «ОТПРАВИТЬ ОТВЕТ», выхода из неё нет.
  memes: {
    folder: 'img/memes',            // папка с картинками
    count: 21,                      // сколько картинок: 1.jpg, 2.jpg, … count.jpg
    label: 'БОНУС ЗА ОТВЕТ',
    title: [],                       // большой заголовок над мемами. [] = без заголовка
    text: 'Отсюда выхода нет — можно только листать вниз ♥',
    giant: '',                       // огромная надпись в самом конце. '' = без неё
  },

  music: 'music/angel.mp3',         // музыка. Пусто = без музыки
};

/* =====================================================================
   2. ЭКРАНЫ С ВОПРОСАМИ — идут по порядку сверху вниз.
   Можно менять тексты, удалять экраны, копировать и добавлять новые.

   Заголовок (title) — массив строк. Символы в начале строки:
     *  — строка красная        ~  — только контур
     !  — глитч-эффект          (можно сочетать: '*!ТЕКСТ')

   Типы экранов:
     intro  — заставка          yesno  — да / убегающее нет
     date   — выбор даты        choice — один вариант (карточки)
     multi  — несколько вариантов + «другое»
     text   — поле для текста   final  — билет с ответами
   ===================================================================== */
const SCREENS = [
  {
    type: 'intro',
    bg: 'img/hand.jpg',
    label: 'ЛИЧНОЕ ПРИГЛАШЕНИЕ',
    title: ['У МЕНЯ', 'К ТЕБЕ', '*!ПРЕДЛОЖЕНИЕ'],
    hint: '// включи звук — там музыка ♥', // показывается под кнопкой, только если в CONFIG есть музыка
    stats: [
      ['пара', 'вопросов'],
      ['без', 'вариантов отказаться'],
      ['24/7', 'думаю о тебе'],
    ],
    button: 'ОТКРЫТЬ',
  },
  {
    type: 'yesno',
    id: 'date',
    summary: 'Свидание', icon: '💘',
    bg: 'img/gradient.jpg',
    label: 'ГЛАВНЫЙ ВОПРОС',
    title: ['ПОЙДЁШЬ', 'СО МНОЙ', '*!НА СВИДАНИЕ?'],
    yes: 'ДА ♥',
    no: 'НЕТ',
    // что пишет кнопка «НЕТ», когда убегает
    noTexts: ['ТОЧНО?', 'ПОДУМАЙ ЕЩЁ', 'НУ ПОЖАЛУЙСТА', 'Я ОБИЖУСЬ', 'КНОПКА СЛОМАЛАСЬ'],
    noFinal: 'ЛАДНО, ДА ♥',      // во что она превращается в конце
  },
  {
    type: 'date',
    id: 'when',
    summary: 'Когда', icon: '📅',
    bg: 'img/blob.jpg',
    label: 'ВЫБЕРИ ДЕНЬ',
    title: ['КОГДА', '*ТЕБЕ', '*УДОБНО?'],
    days: 21,                                            // сколько дней показать вперёд
    timePlaceholder: '…',                            // подсказка в поле для времени
    button: 'ДАЛЬШЕ',
  },
  {
    type: 'choice',
    id: 'cinema',
    summary: 'Кино', icon: '🎬',
    bg: 'img/lines.jpg',
    label: 'ПЛАН НА ВЕЧЕР',
    title: ['ПОЙДЁМ', '*!В КИНО?'],
    options: [
      { value: 'yes',  title: 'Да, в кино',   text: 'и попкорн',                 emoji: '🎬' },
      { value: 'walk', title: 'Лучше гулять', text: 'огни города и разговоры',  emoji: '🌃' },
      { value: 'any',  title: 'Без разницы',  text: 'главное — с тобой',        emoji: '❤️‍🔥' },
    ],
  },
  {
    type: 'choice',
    id: 'horror',
    summary: 'Ужастик', icon: '👻',
    showIf: (a) => a.cinema && a.cinema.value !== 'walk', // не спрашиваем, если выбрала прогулку
    bg: 'img/tribal.jpg',
    label: 'ПРОВЕРКА НА СМЕЛОСТЬ',
    title: ['А НА', '*!УЖАСТИК?'],
    options: [
      { value: 'hand', title: 'Да, но если дашь руку', emoji: '🫣' },
      { value: 'no',   title: 'Нет, что-нибудь другое, если есть', emoji: '🍿' },
    ],
  },
  /* Еда: сначала «хочешь покушать?» — и дальше развилка.
     Пока не ответила, считаются вопросы ветки «да» (чтобы счётчик шагов не прыгал назад) */
  {
    type: 'choice',
    id: 'eat',
    summary: 'Покушать', icon: '🍽️',
    bg: 'img/liquid.jpg',
    label: 'САМОЕ ВАЖНОЕ',
    title: ['ХОЧЕШЬ', '*ПОКУШАТЬ?'],
    options: [
      { value: 'yes', title: 'Да', emoji: '😋' },
      { value: 'no',  title: 'Нет', emoji: '🙅‍♀️' },
    ],
  },
  {
    type: 'choice',
    id: 'eatWhen',
    summary: 'Когда покушать', icon: '🕐',
    showIf: (a) => !a.eat || a.eat.value === 'yes', // ветка «да»
    bg: 'img/gradient.jpg',
    label: 'ЧТОБЫ НЕ БЫЛО ГОЛОДНО',
    title: ['ДО КИНО', '*ИЛИ', '*ПОСЛЕ?'],
    options: [
      { value: 'before', title: 'До кино',     text: 'а в кино — попкорн',        emoji: '🍝' },
      { value: 'after',  title: 'После кино',  text: 'сходим куда-нибудь после', emoji: '🍿' },
      { value: 'any',    title: 'Без разницы', text: 'как скажешь',               emoji: '😋' },
    ],
  },
  {
    type: 'multi',
    id: 'food',
    summary: 'Что покушать', icon: '🍽️',
    showIf: (a) => !a.eat || a.eat.value === 'yes', // ветка «да»
    bg: 'img/liquid.jpg',
    label: 'ВЫБИРАЙ',
    title: ['ЧТО', '*ПОКУШАЕМ?'],
    text: 'Можно выбрать несколько',
    // хочешь фото вместо смайлика — положи картинку в img и добавь img: 'img/pizza.jpg'
    options: [
      { value: 'pizza',  title: 'Пицца',   emoji: '🍕' },
      { value: 'sushi',  title: 'Суши',    emoji: '🍣' },
      { value: 'burger', title: 'Бургеры', emoji: '🍔' },
      { value: 'pasta',  title: 'Паста',   emoji: '🍝' },
      { value: 'other',  title: 'Другое',  emoji: '✍️', other: true, placeholder: 'Напиши, что хочешь…' },
    ],
    button: 'ДАЛЬШЕ',
  },
  {
    type: 'choice',
    id: 'place',
    summary: 'Кто выбирает место', icon: '📍',
    showIf: (a) => !a.eat || a.eat.value === 'yes', // ветка «да»
    bg: 'img/blob.jpg',
    label: 'ГДЕ ПОКУШАЕМ',
    title: ['КТО', '*ВЫБИРАЕТ', '*МЕСТО?'],
    options: [
      { value: 'you',      title: 'Ты',      text: 'думай сама',         emoji: '🎁' },
      { value: 'me',       title: 'Я',       text: 'знаю одно место',  emoji: '😜' },
      { value: 'together', title: 'Вместе',  text: 'решим на месте',   emoji: '🤝' },
    ],
  },
  {
    type: 'choice',
    id: 'coffee',
    summary: 'Кофе', icon: '☕',
    showIf: (a) => a.eat && a.eat.value === 'no', // ветка «нет»
    bg: 'img/gradient.jpg',
    label: 'ПОСЛЕДНЯЯ ПОПЫТКА',
    title: ['НУ', '*ХОТЯ БЫ', '*КОФЕ?'],
    options: [
      { value: 'yes', title: 'Ладно, кофе',      text: 'и что-нибудь сладенькое', emoji: '☕' },
      { value: 'no',  title: 'Нет, обойдёмся',                                    emoji: '🙅‍♀️' },
    ],
  },
  {
    type: 'text',
    id: 'wish',
    summary: 'Пожелания', icon: '✨',
    bg: 'img/stars.jpg',
    label: 'ПОСЛЕДНИЙ ШТРИХ',
    title: ['ЕСТЬ', '*ПОЖЕЛАНИЯ?'],
    text: 'Необязательно, но мне интересно',
    placeholder: '…',
    button: 'ГОТОВО',
  },
  {
    type: 'final',
    bg: 'img/tribal.jpg',
    label: 'ПРИГЛАШЕНИЕ ПОДТВЕРЖДЕНО',
    title: ['ЭТО', '*!СВИДАНИЕ'],
    stamp: 'ПОДТВЕРЖДЕНО',
    giant: 'ДО ВСТРЕЧИ',
    send: 'ОТПРАВИТЬ ОТВЕТ',
    restart: 'ЗАНОВО',
  },
];

/* Фоновые картинки для карточек, если у варианта нет своей img */
const CARD_IMAGES = ['img/blob.jpg', 'img/tribal.jpg', 'img/liquid.jpg', 'img/stars.jpg', 'img/lines.jpg', 'img/gradient.jpg'];

/* =====================================================================
   ДАЛЬШЕ — ЛОГИКА. Можно не трогать.
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const isFine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const buzz = (ms = 12) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const answers = {};
const history = [];
let current = -1;

/* ---------- FX: искры, сердечки ---------- */
const FX = (() => {
  const c = $('#fx');
  const ctx = c.getContext('2d');
  let W = 0, H = 0;
  const embers = [];
  const hearts = [];
  const pointer = { x: -999, y: -999 };
  let rainUntil = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    c.style.width = W + 'px'; c.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const need = Math.round(Math.min(90, (W * H) / 9000));
    while (embers.length < need) embers.push(ember(true));
    embers.length = need;
  }
  function ember(initial) {
    return {
      x: Math.random() * W, y: initial ? Math.random() * H : H + 10,
      vx: (Math.random() - 0.5) * 0.3, vy: -(0.25 + Math.random() * 1.1),
      r: 0.6 + Math.random() * 1.9, t: Math.random() * 6.28, g: 40 + Math.random() * 60,
    };
  }
  function heart(x, y, s, rot, color, alpha) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha; ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.2);
    ctx.bezierCurveTo(0, -s * 0.5, -s * 0.5, -s * 0.5, -s * 0.5, -s * 0.2);
    ctx.bezierCurveTo(-s * 0.5, s * 0.1, 0, s * 0.3, 0, s * 0.5);
    ctx.bezierCurveTo(0, s * 0.3, s * 0.5, s * 0.1, s * 0.5, -s * 0.2);
    ctx.bezierCurveTo(s * 0.5, -s * 0.5, 0, -s * 0.5, 0, -s * 0.2);
    ctx.fill();
    ctx.restore();
  }
  const COLORS = ['#ff1a1a', '#e10600', '#ff4d4d', '#f4f0ee', '#8b0000'];

  function burst(x, y, n = 36) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 3 + Math.random() * 9;
      hearts.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 3,
        s: 8 + Math.random() * 16, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
        life: 0, max: 70 + Math.random() * 60, color: COLORS[(Math.random() * COLORS.length) | 0], g: 0.22, drag: 0.965,
      });
    }
  }
  function rain(ms = 4000) { rainUntil = performance.now() + ms; }

  function frame(now) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of embers) {
      p.t += 0.05;
      const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy;
      if (d2 < 14000) { const f = (14000 - d2) / 14000; p.vx += (dx / 120) * f * 0.6; p.vy += (dy / 120) * f * 0.6; }
      p.vx *= 0.96; p.vy = p.vy * 0.98 - 0.02;
      p.x += p.vx + Math.sin(p.t) * 0.3; p.y += p.vy;
      if (p.y < -10 || p.x < -20 || p.x > W + 20) Object.assign(p, ember(false));
      const flick = 0.55 + Math.sin(p.t * 3) * 0.35;
      ctx.fillStyle = `rgba(255, ${p.g | 0}, 30, ${0.12 * flick})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.29); ctx.fill();
      ctx.fillStyle = `rgba(255, ${(p.g + 80) | 0}, 70, ${0.9 * flick})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.29); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    if (now < rainUntil && Math.random() < 0.5) {
      hearts.push({
        x: Math.random() * W, y: -20, vx: (Math.random() - 0.5) * 1, vy: 1.5 + Math.random() * 2.5,
        s: 10 + Math.random() * 18, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.08,
        life: 0, max: 400, color: COLORS[(Math.random() * COLORS.length) | 0], g: 0.01, drag: 0.995, rain: true,
      });
    }
    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.life++; h.vx *= h.drag; h.vy = h.vy * h.drag + h.g; h.x += h.vx + (h.rain ? Math.sin(h.life / 20) * 0.6 : 0); h.y += h.vy; h.rot += h.vr;
      const a = h.rain ? 0.9 : Math.max(0, 1 - h.life / h.max);
      if (h.life > h.max || h.y > H + 40) { hearts.splice(i, 1); continue; }
      heart(h.x, h.y, h.s, h.rot, h.color, a);
    }
    requestAnimationFrame(frame);
  }

  addEventListener('resize', resize);
  addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
  addEventListener('pointerleave', () => { pointer.x = pointer.y = -999; });
  resize();
  requestAnimationFrame(frame);
  return { burst, rain };
})();

function burstAt(el, n) {
  const r = el.getBoundingClientRect();
  FX.burst(r.left + r.width / 2, r.top + r.height / 2, n);
}

/* ---------- Свечение за курсором ---------- */
(() => {
  if (!isFine) return;
  const cur = $('#cursor');
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
  addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; });
  (function loop() {
    x += (tx - x) * 0.12; y += (ty - y) * 0.12;
    cur.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(loop);
  })();
})();

/* ---------- Волна при нажатии ---------- */
document.addEventListener('pointerdown', (e) => {
  const el = e.target.closest('.btn, .card, .day');
  if (!el || el.classList.contains('no')) return;
  const r = el.getBoundingClientRect();
  const size = Math.max(r.width, r.height);
  const s = document.createElement('span');
  s.className = 'ripple';
  s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
  el.appendChild(s);
  setTimeout(() => s.remove(), 700);
  buzz(8);
});

/* ---------- Фон ---------- */
const bgEl = $('#bg');
let currentBg = '';
function setBg(src) {
  if (!src || src === currentBg) return;
  currentBg = src;
  const layer = document.createElement('div');
  layer.className = 'bg__layer';
  layer.style.backgroundImage = `url("${src}")`;
  bgEl.appendChild(layer);
  requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add('in')));
  const old = $$('.bg__layer', bgEl).slice(0, -1);
  setTimeout(() => old.forEach((o) => o.remove()), 1500);
}

/* ---------- Заголовок с анимацией по буквам ---------- */
function titleHTML(lines) {
  let d = 0;
  const html = lines.map((raw) => {
    let flags = '';
    while (raw && '*~!'.includes(raw[0])) { flags += raw[0]; raw = raw.slice(1); }
    const cls = ['line', flags.includes('*') && 'accent', flags.includes('~') && 'outline'].filter(Boolean).join(' ');
    const words = raw.split(' ').map((w) =>
      `<span style="white-space:nowrap">${Array.from(w).map((ch) =>
        `<span class="ch" style="animation-delay:${(0.12 + d++ * 0.035).toFixed(3)}s">${esc(ch)}</span>`).join('')}</span>`
    ).join(' ');
    const inner = flags.includes('!') ? `<span class="glitch" data-text="${esc(raw)}">${words}</span>` : `<span>${words}</span>`;
    return `<span class="${cls}">${inner}</span>`;
  }).join('');
  return `<h1 class="title">${html}</h1>`;
}
const delay = (s) => `style="animation-delay:${s}s"`;

/* ---------- Видимые экраны (с учётом showIf) ---------- */
const visible = (i) => !SCREENS[i].showIf || SCREENS[i].showIf(answers);
function visibleList() { return SCREENS.map((_, i) => i).filter(visible); }

/* ---------- Навигация ---------- */
async function show(index, { back = false } = {}) {
  const s = SCREENS[index];
  const app = $('#app');
  const old = $('.screen', app);
  $$('body > .btn.no').forEach((b) => b.remove());
  if (old) { old.classList.remove('enter'); old.classList.add('leave'); setTimeout(() => old.remove(), 700); }
  if (!back && current >= 0) history.push(current);
  current = index;

  setBg(s.bg);
  const list = visibleList();
  const pos = list.indexOf(index);
  $('#stepNow').textContent = String(pos + 1).padStart(2, '0');
  $('#stepTotal').textContent = String(list.length).padStart(2, '0');
  $('#progress').style.width = (pos / (list.length - 1)) * 100 + '%';
  $('#backBtn').classList.toggle('show', history.length > 0 && s.type !== 'final');

  await sleep(old ? 250 : 0);
  const el = document.createElement('section');
  el.className = 'screen enter';
  el.innerHTML = `<div class="screen__inner">${RENDER[s.type](s)}</div>`;
  app.appendChild(el);
  BIND[s.type] && BIND[s.type](el, s);
  bindCommon(el);
  fitText(el);
}

/* Уменьшает огромный текст, если слово не влезает в ширину экрана */
function fitText(root = document) {
  $$('.title, .giant', root).forEach((box) => {
    box.style.fontSize = '';
    let fs = parseFloat(getComputedStyle(box).fontSize);
    for (let i = 0; i < 25; i++) {
      const right = box.getBoundingClientRect().right;
      const over = $$('span[style*="nowrap"]', box).some((w) => w.getBoundingClientRect().right > right + 1);
      if (!over) break;
      fs *= 0.95; box.style.fontSize = fs + 'px';
    }
  });
}
addEventListener('resize', () => fitText());
function next() {
  for (let i = current + 1; i < SCREENS.length; i++) if (visible(i)) return show(i);
}
function back() {
  if (!history.length) return;
  const prev = history.pop();
  show(prev, { back: true });
}
$('#backBtn').addEventListener('click', back);

function bindCommon(el) {
  // Наклон карточек за курсором
  $$('.card', el).forEach((card) => {
    card.addEventListener('animationend', () => { card.style.animation = 'none'; card.style.opacity = 1; }, { once: true });
    if (!isFine) return;
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${-py * 9}deg) rotateY(${px * 11}deg) translateZ(0)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
  $$('[data-next]', el).forEach((b) => b.addEventListener('click', next));
}

/* ---------- Отрисовка экранов ---------- */
const RENDER = {
  intro: (s) => `
    <div class="label fade-up">${esc(s.label)}</div>
    ${titleHTML(s.title)}
    ${s.text ? `<p class="lead fade-up" ${delay(0.8)}>${s.text}</p>` : ''}
    <div class="stats fade-up" ${delay(1)}>
      ${(s.stats || []).map(([n, t]) => `<div class="stat"><b data-count="${esc(n)}">${esc(n)}</b><span>${esc(t)}</span></div>`).join('')}
    </div>
    <div class="fade-up" ${delay(1.2)}><button class="btn" id="startBtn">${esc(s.button)} <span class="arrow">→</span></button></div>
    ${s.hint && CONFIG.music ? `<div class="hint fade-up" ${delay(1.5)}>${esc(s.hint)}</div>` : ''}`,

  yesno: (s) => `
    <div class="label fade-up">${esc(s.label)}</div>
    ${titleHTML(s.title)}
    <div class="yesno fade-up" ${delay(0.9)}>
      <button class="btn yes">${esc(s.yes)}</button>
      <button class="btn no">${esc(s.no)}</button>
    </div>
    <div class="no-hint fade-up" ${delay(1)}></div>`,

  date: (s) => {
    const WD = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    const MON = ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'];
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let days = '';
    for (let i = 0; i < (s.days || 14); i++) {
      const d = new Date(today); d.setDate(today.getDate() + i);
      const we = d.getDay() === 0 || d.getDay() === 6;
      days += `<button class="day${we ? ' weekend' : ''}" data-date="${d.toISOString()}">
        <small>${i === 0 ? 'СЕГОДНЯ' : WD[d.getDay()]}</small><b>${d.getDate()}</b><small>${MON[d.getMonth()]}</small></button>`;
    }
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return `
      <div class="label fade-up">${esc(s.label)}</div>
      ${titleHTML(s.title)}
      <div class="fade-up" ${delay(0.7)}><div class="days">${days}</div></div>
      <label class="custom-date fade-up" ${delay(0.8)}>ИЛИ ДРУГАЯ ДАТА: <input type="date" min="${iso}"></label>
      <div class="sub fade-up" ${delay(0.9)}>ВО СКОЛЬКО?</div>
      <div class="fade-up" ${delay(1)}><input class="other-input" id="timeInput" maxlength="40" autocomplete="off" placeholder="${esc(s.timePlaceholder || '…')}" aria-label="Во сколько"></div>
      <div class="fade-up" ${delay(1.1)}><button class="btn wide" id="goBtn" disabled>${esc(s.button)} <span class="arrow">→</span></button></div>`;
  },

  choice: (s) => `
    <div class="label fade-up">${esc(s.label)}</div>
    ${titleHTML(s.title)}
    ${s.text ? `<p class="lead fade-up" ${delay(0.7)}>${s.text}</p>` : ''}
    <div class="cards">${s.options.map((o, i) => cardHTML(o, i)).join('')}</div>`,

  multi: (s) => `
    <div class="label fade-up">${esc(s.label)}</div>
    ${titleHTML(s.title)}
    ${s.text ? `<p class="lead fade-up" ${delay(0.7)}>${s.text}</p>` : ''}
    <div class="cards grid">${s.options.map((o, i) => cardHTML(o, i)).join('')}</div>
    ${s.options.some((o) => o.other) ? `<input class="other-input hidden" maxlength="80" placeholder="${esc(s.options.find((o) => o.other).placeholder || 'Напиши…')}">` : ''}
    <div class="fade-up" ${delay(1.2)}><button class="btn wide" id="goBtn" disabled>${esc(s.button)} <span class="arrow">→</span></button></div>`,

  text: (s) => `
    <div class="label fade-up">${esc(s.label)}</div>
    ${titleHTML(s.title)}
    ${s.text ? `<p class="lead fade-up" ${delay(0.7)}>${s.text}</p>` : ''}
    <textarea class="textarea fade-up" ${delay(0.85)} maxlength="400" placeholder="${esc(s.placeholder || '')}"></textarea>
    <div class="fade-up" ${delay(1)}><button class="btn wide" id="goBtn">${esc(s.button)} <span class="arrow">→</span></button></div>`,

  final: (s) => {
    const rows = SCREENS.filter((x) => x.id && x.summary && answers[x.id] && visible(SCREENS.indexOf(x)))
      .map((x) => `<div class="ticket__row"><span>${esc(x.summary)}</span><b>${esc(answers[x.id].text)}</b></div>`).join('');
    return `
      <div class="label fade-up">${esc(s.label)}</div>
      ${titleHTML(s.title)}
      <div class="ticket">
        <div class="ticket__head"><span>ADMIT ONE // <b>ТЫ + Я</b></span></div>
        <div class="ticket__rows">${rows}</div>
        <div class="ticket__foot">
          <div class="signature" style="font-size:15px">${esc(CONFIG.signature)}</div>
        </div>
        <div class="stamp">${esc(s.stamp)}</div>
      </div>
      ${s.text ? `<p class="lead fade-up" ${delay(1.9)}>${s.text}</p>` : ''}
      <div class="row fade-up" ${delay(2.1)}>
        <button class="btn" id="sendBtn">${esc(s.send)} <span class="arrow">↗</span></button>
        <button class="btn ghost" id="restartBtn">${esc(s.restart)}</button>
      </div>
      <div class="giant fade-up" ${delay(2.3)}>${s.giant.split(' ').map((w) => `<span style="white-space:nowrap">${esc(w)}</span>`).join(' ')}</div>`;
  },
};

function cardHTML(o, i) {
  const img = o.img || CARD_IMAGES[i % CARD_IMAGES.length];
  return `
    <button class="card${o.img ? ' has-photo' : ''}" data-value="${esc(o.value)}" ${delay(0.6 + i * 0.08)}>
      <div class="card__img" style="background-image:url('${esc(img)}')${o.img ? ';opacity:.8' : ''}"></div>
      <span class="card__num">0${i + 1}</span>
      ${o.emoji ? `<span class="card__emoji">${o.emoji}</span>` : ''}
      <span class="card__text"><b>${esc(o.title)}</b>${o.text ? `<span>${esc(o.text)}</span>` : ''}</span>
    </button>`;
}

/* ---------- Логика экранов ---------- */
const BIND = {
  intro(el) {
    // Счётчик цифр
    $$('[data-count]', el).forEach((b) => {
      const n = b.dataset.count;
      if (!/^\d+$/.test(n)) return;
      const target = +n; let v = 0; b.textContent = '0';
      const t = setInterval(() => { v = Math.min(target, v + Math.ceil(target / 20) || 1); b.textContent = v; if (v >= target) clearInterval(t); }, 40);
    });
    $('#startBtn', el).addEventListener('click', (e) => {
      startMusic();
      burstAt(e.currentTarget, 24);
      next();
    });
  },

  yesno(el, s) {
    const yes = $('.yes', el), no = $('.no', el), hint = $('.no-hint', el);
    const hints = ['// неправильный ответ', '// попробуй ещё раз', '// система не принимает «нет»', '// ошибка 404: отказ не найден', '// ну ты поняла 😌'];
    let tries = 0, surrendered = false;

    const sayYes = async (btn) => {
      answers[s.id] = { value: 'yes', text: 'ДА' };
      buzz([20, 40, 60]);
      burstAt(btn, 70);
      document.body.classList.add('shake');
      setTimeout(() => document.body.classList.remove('shake'), 500);
      FX.rain(1500);
      await sleep(1000);
      no.remove();
      next();
    };

    const dodge = () => {
      if (surrendered) return;
      tries++;
      buzz(25);
      if (tries > s.noTexts.length) {
        surrendered = true;
        no.textContent = s.noFinal;
        no.style.background = 'var(--red-2)'; no.style.color = '#000'; no.style.borderColor = 'transparent';
        hint.textContent = '// так-то лучше';
        return;
      }
      no.textContent = s.noTexts[tries - 1];
      hint.textContent = hints[(tries - 1) % hints.length];
      yes.style.transform = `scale(${Math.min(1 + tries * 0.13, 1.7)})`;

      const r = no.getBoundingClientRect();
      if (!no.classList.contains('flying')) {
        no.style.left = r.left + 'px'; no.style.top = r.top + 'px';
        no.classList.add('flying');
        document.body.appendChild(no); // переносим в body, чтобы кнопка летала по всему экрану
        no.offsetWidth; // reflow
      }
      const yr = yes.getBoundingClientRect();
      const top = 90, bottom = innerHeight - 80 - r.height, maxX = innerWidth - r.width - 16;
      let x, y, k = 0;
      do {
        x = 16 + Math.random() * Math.max(0, maxX - 16);
        y = top + Math.random() * Math.max(0, bottom - top);
        k++;
      } while (k < 20 && x < yr.right + 20 && x + r.width > yr.left - 20 && y < yr.bottom + 20 && y + r.height > yr.top - 20);
      no.style.left = x + 'px'; no.style.top = y + 'px';
    };

    yes.addEventListener('click', () => sayYes(yes));
    no.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') dodge(); });
    no.addEventListener('pointerdown', (e) => { if (!surrendered) { e.preventDefault(); dodge(); } });
    no.addEventListener('click', (e) => { e.preventDefault(); if (surrendered) sayYes(no); });
  },

  date(el, s) {
    const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const WD = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    let date = null, time = null;
    const go = $('#goBtn', el), input = $('input[type=date]', el);
    const check = () => { go.disabled = !(date && time); };

    $$('.day', el).forEach((d) => d.addEventListener('click', () => {
      $$('.day', el).forEach((x) => x.classList.remove('on'));
      d.classList.add('on'); input.value = '';
      date = new Date(d.dataset.date); check();
    }));
    input.addEventListener('change', () => {
      if (!input.value) return;
      $$('.day', el).forEach((x) => x.classList.remove('on'));
      const [y, m, dd] = input.value.split('-').map(Number);
      date = new Date(y, m - 1, dd); check();
    });
    const timeInput = $('#timeInput', el);
    timeInput.addEventListener('input', () => { time = timeInput.value.trim(); check(); });
    go.addEventListener('click', () => {
      const txt = `${WD[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} · ${time}`;
      answers[s.id] = { value: date.toISOString(), text: txt };
      burstAt(go, 20);
      next();
    });
  },

  choice(el, s) {
    let locked = false;
    $$('.card', el).forEach((card) => card.addEventListener('click', async () => {
      if (locked) return; locked = true;
      $$('.card', el).forEach((x) => x.classList.remove('on'));
      card.classList.add('on');
      const o = s.options.find((x) => x.value === card.dataset.value);
      answers[s.id] = { value: o.value, text: o.title };
      burstAt(card, 30);
      await sleep(750);
      next();
    }));
  },

  multi(el, s) {
    const go = $('#goBtn', el), other = $('.other-input', el);
    const picked = new Set();
    $$('.card', el).forEach((card) => card.addEventListener('click', () => {
      const v = card.dataset.value, o = s.options.find((x) => x.value === v);
      if (picked.has(v)) { picked.delete(v); card.classList.remove('on'); }
      else { picked.add(v); card.classList.add('on'); burstAt(card, 14); }
      if (o.other && other) { other.classList.toggle('hidden', !picked.has(v)); if (picked.has(v)) other.focus(); }
      go.disabled = picked.size === 0;
    }));
    go.addEventListener('click', () => {
      const parts = s.options.filter((o) => picked.has(o.value)).map((o) => (o.other && other && other.value.trim() ? other.value.trim() : o.title));
      answers[s.id] = { value: [...picked], text: parts.join(', ') };
      burstAt(go, 20);
      next();
    });
  },

  text(el, s) {
    const ta = $('textarea', el);
    ta.addEventListener('animationend', () => { ta.style.animation = 'none'; ta.style.opacity = 1; }, { once: true });
    $('#goBtn', el).addEventListener('click', (e) => {
      const v = ta.value.trim();
      if (v) answers[s.id] = { value: v, text: v }; else delete answers[s.id];
      burstAt(e.currentTarget, 20);
      next();
    });
  },

  final(el) {
    setTimeout(() => { FX.rain(4500); buzz([30, 60, 30]); }, 1600);
    preloadMemes();
    $('#sendBtn', el).addEventListener('click', sendAnswer);
    $('#restartBtn', el).addEventListener('click', () => {
      for (const k in answers) delete answers[k];
      history.length = 0; current = -1;
      show(0);
    });
  },
};

/* ---------- Отправка ответа ---------- */
/* Ответы в виде [вопрос, ответ] — в том порядке, в котором шли экраны */
function answerRows() {
  return SCREENS.filter((x, i) => x.id && x.summary && answers[x.id] && visible(i))
    .map((x) => [x.summary, answers[x.id].text]);
}
function answerText() {
  const lines = ['💌 Ответ на приглашение', ''];
  answerRows().forEach(([q, a]) => lines.push(`${q}: ${a}`));
  return lines.join('\n');
}
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2800);
}
/* Общий POST. Тело — form-urlencoded, а не JSON: иначе браузер шлёт предварительный
   OPTIONS-запрос, который Telegram не принимает. Возвращает ответ сервера (JSON) или null */
async function postForm(url, params, ms = 10000) {
  const ctrl = new AbortController();
  const stop = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { method: 'POST', body: new URLSearchParams(params), signal: ctrl.signal });
    if (!r.ok) return null;
    return await r.json().catch(() => ({}));
  } catch (e) {
    return null;
  } finally {
    clearTimeout(stop);
  }
}
/* Письмо тебе на почту (FormSubmit) — тихо, она ничего не видит.
   Каждый вопрос уходит отдельным полем: письмо приходит таблицей «вопрос — ответ» */
async function sendViaEmail() {
  const d = new Date();
  const when = `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const params = { _subject: 'Ответ на приглашение ♥', _template: 'table', 'Когда отправлено': when };
  answerRows().forEach(([q, a]) => { params[q] = a; });
  const j = await postForm(`https://formsubmit.co/ajax/${CONFIG.email}`, params);
  // сервис отвечает 200 ОК даже когда письма не будет — например, если сайт открыт
  // как файл (двойным кликом), а не по ссылке. Поэтому смотрим на success в ответе
  return !!j && String(j.success) === 'true';
}
/* Личка тебе в Telegram через бота */
async function sendViaBot(text) {
  const j = await postForm(`https://api.telegram.org/bot${CONFIG.botToken}/sendMessage`, { chat_id: CONFIG.chatId, text }, 8000);
  return !!j && j.ok === true;
}
let sending = false;
/* Кнопка «ОТПРАВИТЬ ОТВЕТ»: она сразу уходит на страницу с мемами,
   а ответ уходит тебе в фоновом режиме — три попытки, чтобы не потерять */
async function sendAnswer() {
  if (sending) return;
  sending = true;
  showMemes();
  if (!CONFIG.email && !(CONFIG.botToken && CONFIG.chatId)) return;
  const text = answerText();
  try {
    for (let i = 0; i < 3; i++) {
      if (CONFIG.botToken && CONFIG.chatId && await sendViaBot(text)) return;
      if (CONFIG.email && await sendViaEmail()) return;
      await sleep(3000);
    }
  } finally {
    sending = false;
  }
}

/* ---------- Финальная страница с мемами ---------- */
let memeImgs = null;
function memeList() {
  const m = CONFIG.memes || {};
  return Array.from({ length: m.count || 0 }, (_, i) => `${m.folder}/${i + 1}.jpg`);
}
/* Картинки начинаем грузить заранее — пока она читает билет */
function preloadMemes() {
  if (memeImgs) return;
  memeImgs = memeList().map((src) => { const i = new Image(); i.src = src; return i; });
}
function showMemes() {
  const m = CONFIG.memes || {};
  const app = $('#app');
  const old = $('.screen', app);
  if (old) { old.classList.remove('enter'); old.classList.add('leave'); setTimeout(() => old.remove(), 700); }
  history.length = 0;
  $('#backBtn').classList.remove('show');

  const el = document.createElement('section');
  el.className = 'screen memes enter';
  el.innerHTML = `<div class="screen__inner memes__inner">
      ${m.label ? `<div class="label fade-up">${esc(m.label)}</div>` : ''}
      ${m.title && m.title.length ? titleHTML(m.title) : ''}
      ${m.text ? `<p class="lead fade-up" ${delay(0.8)}>${m.text}</p>` : ''}
      <div class="masonry" ${delay(1)}></div>
      ${m.giant ? `<div class="giant fade-up">${m.giant.split(' ').map((w) => `<span style="white-space:nowrap">${esc(w)}</span>`).join(' ')}</div>` : ''}
      ${CONFIG.signature ? `<div class="signature fade-up">${esc(CONFIG.signature)}</div>` : ''}
    </div>`;
  const wall = $('.masonry', el);
  preloadMemes();
  memeImgs.forEach((img, i) => {
    if (img.complete && !img.naturalWidth) return; // файла нет — пропускаем
    const fig = document.createElement('figure');
    fig.className = 'meme';
    fig.style.animationDelay = (1 + i * 0.07).toFixed(2) + 's';
    const fit = () => { fig.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`; };
    if (img.complete && img.naturalWidth) fit(); else img.addEventListener('load', fit, { once: true });
    img.addEventListener('error', () => fig.remove(), { once: true });
    img.loading = 'lazy'; img.alt = '';
    fig.appendChild(img); wall.appendChild(fig);
  });
  app.appendChild(el);
  fitText(el);
  FX.rain(4000);
  setTimeout(() => FX.rain(4000), 6000);
}

/* ---------- Музыка ---------- */
const audio = $('#music'), musicBtn = $('#musicBtn');
// музыку грузим заранее, чтобы она стартовала сразу после «ОТКРЫТЬ»
if (CONFIG.music) { audio.src = CONFIG.music; audio.volume = 0.6; audio.preload = 'auto'; audio.load(); musicBtn.hidden = false; }
function startMusic() {
  if (!CONFIG.music) return;
  audio.play().then(() => musicBtn.classList.add('playing'))
    .catch(() => toast('Музыка не включилась — нажми на кнопочку внизу справа ♥'));
}
musicBtn.addEventListener('click', () => {
  if (audio.paused) startMusic(); else { audio.pause(); musicBtn.classList.remove('playing'); }
});

/* ---------- Загрузка ---------- */
(async () => {
  const imgs = [...new Set([...SCREENS.map((s) => s.bg), ...CARD_IMAGES].filter(Boolean))];
  let loaded = 0;
  const count = $('#loaderCount'), bar = $('#loaderBar');
  let shown = 0;
  const target = () => Math.round((loaded / imgs.length) * 100);
  const tick = setInterval(() => {
    shown = Math.min(target(), shown + 3);
    count.textContent = String(shown).padStart(3, '0');
    bar.style.width = shown + '%';
  }, 30);
  await Promise.race([
    Promise.all(imgs.map((src) => new Promise((r) => { const i = new Image(); i.onload = i.onerror = () => { loaded++; r(); }; i.src = src; }))),
    sleep(6000),
  ]);
  loaded = imgs.length;
  await document.fonts?.ready;
  while (shown < 100) await sleep(30);
  clearInterval(tick);
  await sleep(250);
  $('#loader').classList.add('done');
  show(0);
})();
