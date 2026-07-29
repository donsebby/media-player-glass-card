const CARD_VERSION = "1.0.0";
console.info(
  "%c MEDIA-PLAYER-GLASS-CARD %c v1.0.0 ",
  "color: white; background: #a78bfa; font-weight: 700;",
  "color: #a78bfa; background: white; font-weight: 700;"
);

const INK = "var(--primary-text-color, #fff)";
const DEFAULT_ACCENT = "#a78bfa"; // same as PALETTE[0] in liquid-glass-tile-card-v2

const FEATURE = {
  PAUSE: 1,
  SEEK: 2,
  VOLUME_SET: 4,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,
  PLAY: 16384,
};

const STYLE = `
  :host { display: block; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
  .card {
    position: relative;
    background: color-mix(in oklch, var(--card-background-color, #17181f) var(--bg-pct, 70%), transparent);
    backdrop-filter: blur(22px) saturate(180%);
    -webkit-backdrop-filter: blur(22px) saturate(180%);
    border: 1px solid color-mix(in srgb, ${INK} 12%, transparent);
    border-radius: 20px;
    padding: 18px;
    box-shadow: 0 20px 40px -20px rgba(0,0,0,0.35), inset 0 1px 0 color-mix(in srgb, ${INK} 10%, transparent);
    box-sizing: border-box;
  }
  .topbar { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
  .topbar ha-icon { --mdc-icon-size: 15px; color: color-mix(in srgb, ${INK} 60%, transparent); }
  .topbar .device-label { font-size: 12px; font-weight: 600; color: color-mix(in srgb, ${INK} 65%, transparent); letter-spacing: 0.02em; }

  .iconbox {
    position: relative; display: flex; align-items: center; justify-content: center;
    border-radius: 11px; border: 1px solid color-mix(in srgb, ${INK} 26%, rgba(255,255,255,0.5));
    background: linear-gradient(155deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.22) 45%, rgba(255,255,255,0.4) 100%);
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.28), inset 2px 0 4px rgba(80,200,255,0.28), inset -2px 0 4px rgba(255,90,190,0.25);
    color: ${INK}; cursor: pointer; transition: box-shadow .15s ease, filter .15s ease, background .15s ease;
    padding: 0; flex: none; width: 34px; height: 34px;
  }
  .iconbox.big { width: 58px; height: 58px; border-radius: 50%; }
  .iconbox.small { width: 40px; height: 40px; }
  .iconbox ha-icon { --mdc-icon-size: 18px; }
  .iconbox.big ha-icon { --mdc-icon-size: 26px; }
  .iconbox.small ha-icon { --mdc-icon-size: 20px; }
  .iconbox.active {
    background: linear-gradient(155deg, color-mix(in srgb, var(--c) 45%, rgba(255,255,255,0.3)) 0%, rgba(255,255,255,0.14) 45%, color-mix(in srgb, var(--c) 45%, rgba(255,255,255,0.3)) 100%);
    box-shadow: inset 0 0 10px color-mix(in srgb, var(--c) 30%, white), inset 0 1px 1px rgba(255,255,255,0.5),
      0 0 14px -2px color-mix(in srgb, var(--c) 55%, transparent), 0 3px 10px -3px color-mix(in srgb, var(--c) 50%, transparent),
      inset 2px 0 4px rgba(80,200,255,0.24), inset -2px 0 4px rgba(255,90,190,0.22);
    filter: brightness(1.08) saturate(1.35);
  }

  .art {
    position: relative; width: 100%; aspect-ratio: 1.9 / 1; border-radius: 16px; overflow: hidden;
    margin-bottom: 14px; border: 1px solid color-mix(in srgb, ${INK} 10%, transparent);
    display: flex; align-items: center; justify-content: center;
    background: color-mix(in srgb, ${INK} 6%, transparent);
  }
  .art img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .art .fallback {
    width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    border: 1px solid color-mix(in srgb, ${INK} 26%, rgba(255,255,255,0.5));
    background: linear-gradient(155deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.22) 45%, rgba(255,255,255,0.4) 100%);
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.28), inset 2px 0 4px rgba(80,200,255,0.28), inset -2px 0 4px rgba(255,90,190,0.25);
    color: color-mix(in srgb, ${INK} 55%, transparent);
  }
  .art .fallback ha-icon { --mdc-icon-size: 26px; }

  .name { font-size: 16px; font-weight: 600; color: ${INK}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-size: 12.5px; color: color-mix(in srgb, ${INK} 55%, transparent); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .row { display: flex; align-items: center; gap: 10px; }
  .row + .row { margin-top: 12px; }
  .time { font-size: 11px; font-variant-numeric: tabular-nums; color: color-mix(in srgb, ${INK} 50%, transparent); width: 34px; flex: none; }
  .time.right { text-align: right; }

  .track {
    position: relative; height: 8px; border-radius: 999px; flex: 1;
    background: color-mix(in srgb, ${INK} 14%, transparent);
    touch-action: none; cursor: grab;
  }
  .track.disabled { opacity: 0.4; pointer-events: none; }
  .fill {
    position: absolute; top: 0; left: 0; height: 100%; border-radius: 999px; background: var(--c);
    box-shadow: 0 0 calc(6px + var(--glow, 0.5) * 10px) -2px var(--c);
  }
  .lens {
    position: absolute; top: 50%; width: 26px; height: 16px; border-radius: 999px; transform: translate(-50%, -50%);
    cursor: grab;
    background: linear-gradient(155deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.28) 100%);
    backdrop-filter: blur(3px) saturate(220%) brightness(1.35); -webkit-backdrop-filter: blur(3px) saturate(220%) brightness(1.35);
    border: 1px solid rgba(255,255,255,0.6);
    box-shadow: 0 2px 6px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.8), inset 0 -2px 3px rgba(0,0,0,0.15),
      inset 2px 0 5px rgba(80,200,255,0.32), inset -2px 0 5px rgba(255,90,190,0.3);
  }

  .controls { display: flex; align-items: center; justify-content: center; gap: 20px; margin: 16px 0; }
  ha-icon.leading { --mdc-icon-size: 18px; color: color-mix(in srgb, ${INK} 65%, transparent); flex: none; }
`;

function fmtTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

class MediaPlayerGlassCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error('media-player-glass-card: "entity" is required');
    }
    this._config = config;
    this._accent = config.accent_color || DEFAULT_ACCENT;
    this._build();
    if (this._cardEl) {
      if (config.bg_opacity != null) {
        this._cardEl.style.setProperty("--bg-pct", Math.max(0, Math.min(100, 100 * config.bg_opacity)) + "%");
      } else {
        this._cardEl.style.removeProperty("--bg-pct");
      }
    }
    if (this._built) {
      this._labelIconEl.setAttribute("icon", config.icon || "mdi:cast");
      this._labelTextEl.textContent = config.label || config.entity;
    }
  }

  static getStubConfig() {
    return {
      type: "custom:media-player-glass-card",
      entity: "media_player.appletv_jellyfin_bild",
      label: "Apple TV",
      icon: "mdi:apple",
    };
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  getCardSize() {
    return 5;
  }

  connectedCallback() {
    this._tickInterval = setInterval(() => this._tick(), 1000);
  }
  disconnectedCallback() {
    if (this._tickInterval) clearInterval(this._tickInterval);
  }

  _features(stateObj) {
    const f = (stateObj && stateObj.attributes && stateObj.attributes.supported_features) || 0;
    return {
      pause: !!(f & FEATURE.PAUSE),
      play: !!(f & FEATURE.PLAY),
      seek: !!(f & FEATURE.SEEK),
      volume: !!(f & FEATURE.VOLUME_SET),
      prev: !!(f & FEATURE.PREVIOUS_TRACK),
      next: !!(f & FEATURE.NEXT_TRACK),
    };
  }

  _haptic(intensity) {
    this.dispatchEvent(new CustomEvent("haptic", { bubbles: true, composed: true, detail: intensity }));
  }

  _build() {
    if (this._built) return;
    this._built = true;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <div class="card">
        <div class="topbar">
          <ha-icon id="label-icon" icon="${this._config.icon || "mdi:cast"}"></ha-icon>
          <span class="device-label" id="label-text">${this._config.label || this._config.entity}</span>
        </div>
        <div class="art" id="art">
          <img id="art-img" style="display:none" />
          <div class="fallback" id="art-fallback"><ha-icon icon="mdi:music"></ha-icon></div>
        </div>
        <div class="name" id="name"></div>
        <div class="sub" id="sub"></div>
        <div class="row" style="margin-top:14px">
          <span class="time" id="time-elapsed">0:00</span>
          <div class="track" id="progress-track">
            <div class="fill" id="progress-fill"></div>
            <div class="lens" id="progress-lens"></div>
          </div>
          <span class="time right" id="time-remaining">-0:00</span>
        </div>
        <div class="controls" id="controls">
          <button class="iconbox small" id="btn-prev"><ha-icon icon="mdi:skip-previous"></ha-icon></button>
          <button class="iconbox big" id="btn-playpause"><ha-icon icon="mdi:play"></ha-icon></button>
          <button class="iconbox small" id="btn-next"><ha-icon icon="mdi:skip-next"></ha-icon></button>
        </div>
        <div class="row" id="volume-row">
          <ha-icon class="leading" id="volume-icon" icon="mdi:volume-high"></ha-icon>
          <div class="track" id="volume-track">
            <div class="fill" id="volume-fill"></div>
            <div class="lens" id="volume-lens"></div>
          </div>
        </div>
      </div>
    `;

    this._cardEl = this.shadowRoot.querySelector(".card");
    this._labelIconEl = this.shadowRoot.getElementById("label-icon");
    this._labelTextEl = this.shadowRoot.getElementById("label-text");
    this._artImg = this.shadowRoot.getElementById("art-img");
    this._artFallback = this.shadowRoot.getElementById("art-fallback");
    this._nameEl = this.shadowRoot.getElementById("name");
    this._subEl = this.shadowRoot.getElementById("sub");
    this._timeElapsedEl = this.shadowRoot.getElementById("time-elapsed");
    this._timeRemainingEl = this.shadowRoot.getElementById("time-remaining");
    this._progressTrack = this.shadowRoot.getElementById("progress-track");
    this._progressFill = this.shadowRoot.getElementById("progress-fill");
    this._progressLens = this.shadowRoot.getElementById("progress-lens");
    this._controlsEl = this.shadowRoot.getElementById("controls");
    this._btnPrev = this.shadowRoot.getElementById("btn-prev");
    this._btnPlayPause = this.shadowRoot.getElementById("btn-playpause");
    this._btnNext = this.shadowRoot.getElementById("btn-next");
    this._volumeRow = this.shadowRoot.getElementById("volume-row");
    this._volumeIcon = this.shadowRoot.getElementById("volume-icon");
    this._volumeTrack = this.shadowRoot.getElementById("volume-track");
    this._volumeFill = this.shadowRoot.getElementById("volume-fill");
    this._volumeLens = this.shadowRoot.getElementById("volume-lens");

    this._artImg.addEventListener("error", () => {
      this._artImg.style.display = "none";
      this._artFallback.style.display = "flex";
    });

    this._btnPrev.addEventListener("click", () => this._callMedia("media_previous_track"));
    this._btnNext.addEventListener("click", () => this._callMedia("media_next_track"));
    this._btnPlayPause.addEventListener("click", () => this._callMedia("media_play_pause"));

    this._bindDrag(this._progressTrack, this._progressFill, this._progressLens, (pct) => {
      if (!this._duration) return;
      const seconds = Math.round(pct * this._duration);
      this._positionBase = seconds;
      this._positionAt = Date.now();
      this._callMedia("media_seek", { seek_position: seconds });
    });
    this._bindDrag(this._volumeTrack, this._volumeFill, this._volumeLens, (pct) => {
      this._callMedia("volume_set", { volume_level: Math.round(pct * 100) / 100 });
    });
  }

  _callMedia(service, data) {
    if (!this._hass || !this._config) return;
    this._hass.callService("media_player", service, { entity_id: this._config.entity, ...(data || {}) });
    this._haptic("light");
  }

  _setTrackPct(fillEl, lensEl, pct) {
    const clamped = Math.max(0, Math.min(1, pct));
    fillEl.style.width = `${clamped * 100}%`;
    fillEl.parentElement.style.setProperty("--glow", Math.max(0.15, clamped));
    lensEl.style.left = `calc(13px + (100% - 26px) * ${clamped})`;
  }

  _bindDrag(trackEl, fillEl, lensEl, onCommit) {
    let dragging = false;
    const pctFromEvent = (e) => {
      const rect = trackEl.getBoundingClientRect();
      return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    };
    trackEl.addEventListener("pointerdown", (e) => {
      if (trackEl.classList.contains("disabled")) return;
      dragging = true;
      trackEl.setPointerCapture(e.pointerId);
      this._setTrackPct(fillEl, lensEl, pctFromEvent(e));
    });
    trackEl.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      this._setTrackPct(fillEl, lensEl, pctFromEvent(e));
    });
    const end = (e) => {
      if (!dragging) return;
      dragging = false;
      onCommit(pctFromEvent(e));
    };
    trackEl.addEventListener("pointerup", end);
    trackEl.addEventListener("pointercancel", end);
  }

  _tick() {
    if (!this._built || this._duration == null) return;
    let elapsed = this._positionBase || 0;
    if (this._isPlaying && this._positionAt) {
      elapsed += (Date.now() - this._positionAt) / 1000;
    }
    elapsed = Math.max(0, Math.min(this._duration || 0, elapsed));
    this._timeElapsedEl.textContent = fmtTime(elapsed);
    this._timeRemainingEl.textContent = "-" + fmtTime((this._duration || 0) - elapsed);
    if (this._duration) {
      this._setTrackPct(this._progressFill, this._progressLens, elapsed / this._duration);
    } else {
      this._setTrackPct(this._progressFill, this._progressLens, 0);
    }
  }

  _update() {
    if (!this._hass || !this._config || !this._built) return;
    const stateObj = this._hass.states[this._config.entity];
    const feat = this._features(stateObj);
    const attrs = (stateObj && stateObj.attributes) || {};
    const state = stateObj ? stateObj.state : "unavailable";
    const isAvailable = state !== "unavailable" && state !== "unknown";
    const isPlaying = state === "playing";
    this._isPlaying = isPlaying;

    // artwork
    const picture = attrs.entity_picture;
    if (picture) {
      this._artImg.src = picture;
      this._artImg.style.display = "block";
      this._artFallback.style.display = "none";
    } else {
      this._artImg.style.display = "none";
      this._artFallback.style.display = "flex";
    }

    // text
    const title = attrs.media_title || (isAvailable ? "Nichts l\u00e4uft" : "Nicht verf\u00fcgbar");
    let sub;
    if (attrs.media_series_title) {
      sub = `${attrs.media_series_title} \u00B7 S${attrs.media_season}E${attrs.media_episode}`;
    } else if (attrs.media_artist) {
      sub = attrs.media_artist;
    } else {
      sub = this._config.label || this._config.entity;
    }
    this._nameEl.textContent = title;
    this._subEl.textContent = sub;

    // progress (always shown; interactive only if seekable)
    this._duration = attrs.media_duration || 0;
    this._positionBase = attrs.media_position || 0;
    this._positionAt = attrs.media_position_updated_at ? new Date(attrs.media_position_updated_at).getTime() : Date.now();
    this._progressTrack.classList.toggle("disabled", !feat.seek || !isAvailable || !this._duration);
    this._progressTrack.style.setProperty("--c", this._accent);
    this._tick();

    // transport controls — only rendered at all when actually controllable
    const showPrev = feat.prev && isAvailable;
    const showNext = feat.next && isAvailable;
    const showPlayPause = (feat.pause || feat.play) && isAvailable;
    this._btnPrev.style.display = showPrev ? "flex" : "none";
    this._btnNext.style.display = showNext ? "flex" : "none";
    this._btnPlayPause.style.display = showPlayPause ? "flex" : "none";
    this._controlsEl.style.display = showPrev || showNext || showPlayPause ? "flex" : "none";
    if (showPlayPause) {
      this._btnPlayPause.classList.toggle("active", isPlaying);
      this._btnPlayPause.style.setProperty("--c", this._accent);
      this._btnPlayPause.querySelector("ha-icon").setAttribute("icon", isPlaying ? "mdi:pause" : "mdi:play");
    }

    // volume — only rendered when actually controllable
    if (feat.volume && isAvailable) {
      this._volumeRow.style.display = "flex";
      const vol = attrs.volume_level != null ? attrs.volume_level : 0;
      this._volumeTrack.style.setProperty("--c", this._accent);
      this._setTrackPct(this._volumeFill, this._volumeLens, vol);
      this._volumeIcon.setAttribute("icon", vol === 0 ? "mdi:volume-mute" : vol < 0.5 ? "mdi:volume-medium" : "mdi:volume-high");
    } else {
      this._volumeRow.style.display = "none";
    }
  }
}

customElements.define("media-player-glass-card", MediaPlayerGlassCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "media-player-glass-card",
  name: "Media Player Glass Card (dev)",
  description: "Liquid-Glass Media-Player fuer eine einzelne Entity: echtes Artwork, Progress, und Controls nur wenn tatsaechlich steuerbar.",
});
