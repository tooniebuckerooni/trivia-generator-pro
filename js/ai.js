/* Trivia Generator Pro — AI Question Generator (paid add-on).
   Entirely optional: the free app works fully with this file absent or
   failing to load. Talks only to the Worker in worker.js — never calls
   LemonSqueezy or Anthropic directly, and never holds an API key. */
(() => {
  "use strict";
  const $ = s => document.querySelector(s);
  const KEY_STORE = "tgp_license_v1";

  // Fill in after deploying worker.js and creating the LemonSqueezy product.
  const WORKER_URL = "https://tgp-ai-gateway.YOUR-SUBDOMAIN.workers.dev";
  const CHECKOUT_URL = "https://REPLACE-WITH-YOUR-LEMONSQUEEZY-CHECKOUT-URL";

  // License state lives in its own storage key, separate from the game
  // state in app.js — it's account-level, not game-level, so it must
  // survive Reset and must never end up inside an exported .tgp.json file.
  let lic = { key: "", instance_id: "", active: false, status: "", used: null, cap: null, error: "" };

  function loadLicense() {
    try {
      const raw = localStorage.getItem(KEY_STORE);
      if (raw) lic = { ...lic, ...JSON.parse(raw) };
    } catch (e) { /* corrupted — start fresh */ }
  }

  function saveLicense() {
    try {
      localStorage.setItem(KEY_STORE, JSON.stringify({
        key: lic.key, instance_id: lic.instance_id, active: lic.active,
        status: lic.status, used: lic.used, cap: lic.cap
      }));
    } catch (e) { /* ignore */ }
  }

  async function call(action, extra) {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        license_key: lic.key,
        instance_id: lic.instance_id || undefined,
        ...extra
      })
    });
    return res.json();
  }

  async function activate(rawKey) {
    const key = (rawKey || "").trim();
    if (!key) return;
    lic = { key, instance_id: "", active: false, status: "activating", used: null, cap: null, error: "" };
    renderStatus();
    try {
      const data = await call("activate", { instance_name: (navigator.userAgent || "device").slice(0, 60) });
      if (data.valid) {
        lic = { key, instance_id: data.instance_id || "", active: true, status: data.status || "active", used: null, cap: null, error: "" };
        saveLicense();
        await checkStatus();
      } else {
        lic.active = false;
        lic.status = "error";
        lic.error = data.error || "Activation failed.";
        renderStatus();
      }
    } catch (e) {
      lic.active = false;
      lic.status = "error";
      lic.error = "Couldn't reach the license server.";
      renderStatus();
    }
  }

  async function checkStatus() {
    if (!lic.key) { renderStatus(); return; }
    try {
      const data = await call("validate", {});
      lic.active = !!data.valid;
      lic.status = data.status || lic.status;
      if (data.used != null) lic.used = data.used;
      if (data.cap != null) lic.cap = data.cap;
      lic.error = data.valid ? "" : (data.error || "License not valid.");
      saveLicense();
    } catch (e) {
      // Network hiccup — keep last-known state; validate itself fails open
      // server-side too, so this only affects the UI, not generation.
    }
    renderStatus();
  }

  function renderStatus() {
    const box = $("#ai-status");
    if (!box) return;
    if (!lic.key) {
      box.innerHTML = '<p class="hint">No license yet — the rest of Trivia Generator Pro works fully without one. '
        + '<a href="' + CHECKOUT_URL + '" target="_blank" rel="noopener">Get AI generation →</a></p>';
    } else if (lic.status === "activating") {
      box.innerHTML = '<p class="hint">Activating…</p>';
    } else if (lic.active) {
      const usage = (lic.cap != null)
        ? "<b>" + (lic.used == null ? 0 : lic.used) + "</b> / " + lic.cap + " generations used this month"
        : "Active";
      box.innerHTML = '<p class="ai-active">✓ AI generator active — ' + usage + '</p>';
    } else {
      box.innerHTML = '<p class="ai-error">' + esc(lic.error || "License not active.") + '</p>';
    }
  }

  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function bindCard() {
    const btn = $("#btn-ai-activate");
    const input = $("#ai-key");
    if (!btn || !input) return;
    btn.addEventListener("click", () => activate(input.value));
    input.addEventListener("keydown", e => { if (e.key === "Enter") activate(input.value); });
  }

  // Returns a Promise<[{question, answer}, ...]>; throws with a
  // user-presentable message on any failure (no license, capped out,
  // network error, server error).
  async function generateForRound(topic, count) {
    if (!lic.key || !lic.active) {
      throw new Error("Activate an AI license first (see the AI Question Generator panel).");
    }
    let data;
    try {
      data = await call("generate", { topic, count: count || 10 });
    } catch (e) {
      throw new Error("Couldn't reach the AI generator - check your connection and try again.");
    }
    if (data.used != null) lic.used = data.used;
    if (data.cap != null) lic.cap = data.cap;
    renderStatus();
    if (!data.ok) throw new Error(data.error || "Generation failed.");
    return data.questions;
  }

  function init() {
    loadLicense();
    bindCard();
    renderStatus();
    if (lic.key) checkStatus();
  }

  window.TGP_AI = { init, generateForRound };
})();
