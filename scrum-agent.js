/* Agile by Killette — Scrum Agent chat widget
   Add to any page:  <script src="/scrum-agent.js" defer></script>
   Set ENDPOINT below to your Cloudflare Worker URL. Until it's set, the widget stays hidden. */
(function () {
  "use strict";
  var ENDPOINT = "https://abk-scrum-agent.bowlingwithmrwendell.workers.dev/api/chat";

  if (!ENDPOINT || ENDPOINT.indexOf("YOUR-WORKER") !== -1) return;
  if (window.__abkScrumAgent) return;
  window.__abkScrumAgent = true;

  var STORE = "abk-scrum-agent-v1";
  var GREETING = "Hi — I'm the Agile by Killette Scrum Agent, an AI assistant. Ask me about sprints, backlog health, retros, dependencies, metrics or using AI on your team.";
  var STARTERS = ["Our daily scrum runs long", "How do I fix a messy backlog?", "Ideas for a stale retro", "How should my team use AI?"];
  var SHIELD = '<svg viewBox="0 0 100 112" aria-hidden="true" focusable="false"><defs><linearGradient id="abksag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6D77A"/><stop offset=".5" stop-color="#D4A73E"/><stop offset="1" stop-color="#B8862A"/></linearGradient></defs><path d="M50 5 L91 17 L91 50 C91 77 73 94 50 107 C27 94 9 77 9 50 L9 17 Z" fill="#0B1F3A" stroke="url(#abksag)" stroke-width="7" stroke-linejoin="round"/><path d="M19.639020197679415 62.0 27.6063601203266 35.82896433175763H32.634293081220456L40.627417275461966 62.0H35.315857327030514L33.897722389342505 56.91534164159862H26.265577997421573L24.847443059733564 62.0ZM32.40223463687151 51.4568113450795 30.08165019338204 43.08207993124195 27.761065749892566 51.4568113450795ZM42.32917920068758 62.0V35.82896433175763H51.55994843145681Q55.118177911474 35.82896433175763 56.87150837988827 37.71701761925226Q58.62483884830253 39.60507090674689 58.62483884830253 42.67082079931242Q58.62483884830253 44.68972926514826 57.90287924366136 46.18521701761925Q57.25827245380317 47.49376880103137 56.17533304684142 48.35367425870219Q56.355822948001716 48.42844864632574 56.51052857756768 48.50322303394929Q57.92866351525569 49.36312849162012 58.71508379888268 50.95208422862055Q59.50150408250967 52.541039965620975 59.50150408250967 54.82165878813924Q59.50150408250967 58.22389342501074 57.6063601203266 60.11194671250537Q55.71121615814353 62.0 52.075633863343356 62.0ZM47.38289643317576 56.6536312849162H51.66308551783412Q52.97808336914482 56.6536312849162 53.66136656639449 55.99935539321014Q54.34464976364417 55.34507950150408 54.34464976364417 53.99914052428019Q54.34464976364417 52.6532015470563 53.66136656639449 51.998925655350234Q52.97808336914482 51.34464976364418 51.66308551783412 51.34464976364418H47.38289643317576ZM47.38289643317576 46.22260421143103H50.8895573700043Q52.17877094972067 46.22260421143103 52.82337773957886 45.58702191663086Q53.46798452943704 44.95143962183069 53.46798452943704 43.68027503223034Q53.46798452943704 42.409110442629995 52.82337773957886 41.79222174473571Q52.17877094972067 41.17533304684143 50.8895573700043 41.17533304684143H47.38289643317576ZM62.41512677266867 62.0V35.82896433175763H67.46884400515685V46.7086377309841L74.4563816072196 35.82896433175763H80.07735281478298L72.70305113880534 47.41899441340782L80.4641168886979 62.0H74.53373442200258L69.37688010313708 52.5036527718092L67.46884400515685 55.457241082939404V62.0Z" fill="url(#abksag)"/><path d="M50.00,74.00 L52.47,80.60 L59.51,80.91 L53.99,85.30 L55.88,92.09 L50.00,88.20 L44.12,92.09 L46.01,85.30 L40.49,80.91 L47.53,80.60Z" fill="url(#abksag)"/></svg>';

  var css = [
    ".abk-sa{position:fixed;right:20px;bottom:20px;z-index:2147483000;font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;color:#14202B}",
    ".abk-sa *{box-sizing:border-box}",
    ".abk-sa-fab{display:flex;align-items:center;gap:10px;background:#152A40;color:#fff;border:2px solid #B08D3E;border-radius:999px;padding:9px 18px 9px 11px;font-family:inherit;font-weight:700;font-size:15px;line-height:1;cursor:pointer;box-shadow:0 10px 30px rgba(21,42,64,.28);transition:transform .15s,box-shadow .15s}",
    ".abk-sa-fab:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(21,42,64,.34)}",
    ".abk-sa-fab:focus-visible,.abk-sa button:focus-visible,.abk-sa textarea:focus-visible{outline:2px solid #C9A85C;outline-offset:1px}",
    ".abk-sa-fab svg{width:26px;height:29px;flex:none}",
    ".abk-sa-panel{position:absolute;right:0;bottom:66px;width:370px;height:560px;max-height:calc(100vh - 110px);background:#fff;border:1px solid #E3E9EF;border-radius:16px;box-shadow:0 18px 50px rgba(21,42,64,.25);display:flex;flex-direction:column;overflow:hidden}",
    ".abk-sa-panel[hidden]{display:none}",
    ".abk-sa-head{display:flex;align-items:center;gap:11px;padding:14px 14px 14px 16px;background:#152A40;color:#fff;border-bottom:3px solid #B08D3E}",
    ".abk-sa-head svg{width:30px;height:34px;flex:none}",
    ".abk-sa-title{flex:1;min-width:0}",
    ".abk-sa-title b{display:block;font-size:16px;letter-spacing:.01em}",
    ".abk-sa-title span{display:block;font-size:12px;color:#C9A85C;margin-top:2px}",
    ".abk-sa-icon{background:transparent;border:0;color:#fff;opacity:.8;cursor:pointer;width:32px;height:32px;border-radius:8px;font-size:20px;line-height:1}",
    ".abk-sa-icon:hover{opacity:1;background:rgba(255,255,255,.1)}",
    ".abk-sa-log{flex:1;overflow-y:auto;padding:16px 14px;background:#F5F8FB;display:flex;flex-direction:column;gap:10px}",
    ".abk-sa-msg{max-width:86%;padding:10px 13px;border-radius:14px;font-size:14.5px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}",
    ".abk-sa-msg.user{align-self:flex-end;background:#1F3B57;color:#fff;border-bottom-right-radius:4px}",
    ".abk-sa-msg.assistant{align-self:flex-start;background:#fff;border:1px solid #E3E9EF;border-bottom-left-radius:4px}",
    ".abk-sa-msg.error{align-self:flex-start;background:#FFF6E8;border:1px solid #E9CF9A;color:#6B4E12}",
    ".abk-sa-chips{display:flex;flex-wrap:wrap;gap:7px}",
    ".abk-sa-chip{background:#fff;border:1px solid #C9A85C;color:#1F3B57;border-radius:999px;padding:6px 11px;font-family:inherit;font-weight:600;font-size:13px;line-height:1.2;cursor:pointer}",
    ".abk-sa-chip:hover{background:#FBF6EA}",
    ".abk-sa-typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px;background:#fff;border:1px solid #E3E9EF;border-radius:14px}",
    ".abk-sa-typing i{width:7px;height:7px;border-radius:50%;background:#B08D3E;animation:abksa 1.1s infinite ease-in-out}",
    ".abk-sa-typing i:nth-child(2){animation-delay:.15s}.abk-sa-typing i:nth-child(3){animation-delay:.3s}",
    "@keyframes abksa{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}",
    ".abk-sa-form{display:flex;gap:8px;padding:12px;border-top:1px solid #E3E9EF;background:#fff}",
    ".abk-sa-form textarea{flex:1;resize:none;border:1px solid #C6D3DF;border-radius:10px;padding:10px 11px;font-family:inherit;font-size:14.5px;line-height:1.35;color:#14202B;max-height:110px}",
    ".abk-sa-send{background:#B08D3E;color:#fff;border:0;border-radius:10px;padding:0 16px;font-family:inherit;font-weight:700;font-size:14px;cursor:pointer}",
    ".abk-sa-send:disabled{opacity:.5;cursor:default}",
    ".abk-sa-foot{padding:0 12px 10px;background:#fff;font-size:11.5px;color:#6B7C8F;text-align:center}",
    ".abk-sa-foot a{color:#1F3B57;font-weight:600}",
    "@media (max-width:520px){.abk-sa{right:12px;bottom:12px}.abk-sa-panel{position:fixed;inset:auto 8px 76px 8px;width:auto;height:calc(100vh - 96px);max-height:none}}",
    "@media (prefers-reduced-motion:reduce){.abk-sa-typing i{animation:none}.abk-sa-fab{transition:none}}"
  ].join("");

  var shieldN = 0;
  function shield() { shieldN++; return SHIELD.replace(/abksag/g, "abksag" + shieldN); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  var history = [];
  try { history = JSON.parse(sessionStorage.getItem(STORE) || "[]"); if (!Array.isArray(history)) history = []; } catch (e) { history = []; }
  function save() { try { sessionStorage.setItem(STORE, JSON.stringify(history.slice(-30))); } catch (e) {} }

  var style = el("style"); style.textContent = css; document.head.appendChild(style);
  var root = el("div", "abk-sa");

  var fab = el("button", "abk-sa-fab");
  fab.type = "button"; fab.setAttribute("aria-expanded", "false"); fab.setAttribute("aria-controls", "abk-sa-panel");
  fab.innerHTML = shield(); fab.appendChild(el("span", null, "Scrum Agent"));

  var panel = el("div", "abk-sa-panel"); panel.id = "abk-sa-panel"; panel.hidden = true;
  panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Scrum Agent chat");

  var head = el("div", "abk-sa-head"); head.innerHTML = shield();
  var title = el("div", "abk-sa-title"); title.appendChild(el("b", null, "Scrum Agent")); title.appendChild(el("span", null, "AI assistant · Agile by Killette"));
  var clearBtn = el("button", "abk-sa-icon", "↺"); clearBtn.type = "button"; clearBtn.title = "Start over"; clearBtn.setAttribute("aria-label", "Start a new conversation");
  var closeBtn = el("button", "abk-sa-icon", "×"); closeBtn.type = "button"; closeBtn.setAttribute("aria-label", "Close chat");
  head.appendChild(title); head.appendChild(clearBtn); head.appendChild(closeBtn);

  var log = el("div", "abk-sa-log"); log.setAttribute("aria-live", "polite");
  var form = el("form", "abk-sa-form");
  var input = el("textarea"); input.rows = 1; input.maxLength = 1500; input.placeholder = "Ask about sprints, backlog, retros…"; input.setAttribute("aria-label", "Your question");
  var send = el("button", "abk-sa-send", "Send"); send.type = "submit";
  form.appendChild(input); form.appendChild(send);
  var foot = el("div", "abk-sa-foot");
  foot.innerHTML = 'AI answers can be wrong. For hands-on help, <a href="https://agilebykillette.com/#contact">book a call with Wendell</a>.';

  panel.appendChild(head); panel.appendChild(log); panel.appendChild(form); panel.appendChild(foot);
  root.appendChild(panel); root.appendChild(fab);
  document.body.appendChild(root);

  var busy = false;

  function scroll() { log.scrollTop = log.scrollHeight; }
  function bubble(role, text) { var m = el("div", "abk-sa-msg " + role, text); log.appendChild(m); scroll(); return m; }

  function render() {
    log.textContent = "";
    bubble("assistant", GREETING);
    if (!history.length) {
      var chips = el("div", "abk-sa-chips");
      STARTERS.forEach(function (s) {
        var c = el("button", "abk-sa-chip", s); c.type = "button";
        c.addEventListener("click", function () { ask(s); });
        chips.appendChild(c);
      });
      log.appendChild(chips);
    }
    history.forEach(function (m) { bubble(m.role, m.content); });
  }

  function setBusy(b) { busy = b; send.disabled = b; input.disabled = b; }

  function ask(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    var chips = log.querySelector(".abk-sa-chips"); if (chips) chips.remove();
    history.push({ role: "user", content: text }); save();
    bubble("user", text);
    input.value = ""; autosize();
    setBusy(true);
    var typing = el("div", "abk-sa-typing"); typing.setAttribute("aria-label", "Scrum Agent is typing");
    typing.appendChild(el("i")); typing.appendChild(el("i")); typing.appendChild(el("i"));
    log.appendChild(typing); scroll();

    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 30000);

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-12) }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, status: r.status, data: d }; });
    }).then(function (res) {
      typing.remove();
      if (res.ok && res.data.reply) {
        res.data.reply = String(res.data.reply).replace(/\*\*([^*]+)\*\*/g, "$1").replace(/__([^_]+)__/g, "$1").replace(/^#{1,6}\s+/gm, "").replace(/^\s*[*]\s+/gm, "• ");
        history.push({ role: "assistant", content: res.data.reply }); save();
        bubble("assistant", res.data.reply);
      } else {
        history.pop(); save();
        bubble("error", res.status === 429 && res.data.reply ? res.data.reply : "Sorry — I couldn't answer just now. Please try again in a moment.");
        input.value = text; autosize();
      }
    }).catch(function () {
      typing.remove(); history.pop(); save();
      bubble("error", "I couldn't reach the Scrum Agent. Check your connection and try again.");
      input.value = text; autosize();
    }).then(function () { clearTimeout(timer); setBusy(false); input.focus(); });
  }

  function autosize() { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 110) + "px"; }

  function open(on) {
    panel.hidden = !on; fab.setAttribute("aria-expanded", String(on));
    if (on) { if (!log.childNodes.length) render(); scroll(); setTimeout(function () { input.focus(); }, 30); }
  }

  fab.addEventListener("click", function () { open(panel.hidden); });
  closeBtn.addEventListener("click", function () { open(false); fab.focus(); });
  clearBtn.addEventListener("click", function () { if (busy) return; history = []; save(); render(); input.focus(); });
  form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
  input.addEventListener("input", autosize);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input.value); } });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) { open(false); fab.focus(); } });
})();
