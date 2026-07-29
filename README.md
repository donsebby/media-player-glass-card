# Media Player Glass Card

A frosted-glass Home Assistant media-player tile in the Liquid Glass style — real
artwork, a draggable progress/volume "lens" slider, and transport controls that
only appear when the entity actually supports them.

Designed to sit alongside [`liquid-glass-tile-card-v2`](https://github.com/donsebby/liquid-glass-tile-card-v2)
and [`liquid-lens-navbar-card`](https://github.com/donsebby/liquid-lens-navbar-card) —
shares the same glass-panel tokens, icon-box gradient, and chromatic-edge lens styling.

One card instance shows **one** media_player entity. Combine with
[`auto-entities`](https://github.com/thomasloven/lovelace-auto-entities) to show a
card per active player (e.g. only while `playing`/`paused`) — see example below.

## Options

| Name | Type | Default | Description |
|---|---|---|---|
| `entity` | string | **required** | A `media_player.*` entity ID |
| `label` | string | entity ID | Small label shown top-left |
| `icon` | string | `mdi:cast` | Small icon shown next to the label |
| `accent_color` | string | `#a78bfa` | Accent used for the play button, progress fill, and volume fill |
| `bg_opacity` | number (0–1) | `0.7` | Panel background opacity (matches `liquid-glass-tile-card-v2`'s `bg_opacity`) |

Controls are feature-gated against the entity's `supported_features`: transport
buttons (prev/play-pause/next) and the volume slider are only rendered at all when
the entity reports that capability, and the progress bar becomes non-interactive
(but stays visible) when the entity doesn't support `SEEK`.

## Example: one card per currently active player

```yaml
type: custom:auto-entities
card:
  type: vertical-stack
show_empty: false
filter:
  include:
    - entity_id: media_player.living_room_appletv
      state: playing
      options:
        type: custom:media-player-glass-card
        label: Apple TV
        icon: mdi:apple
    - entity_id: media_player.living_room_appletv
      state: paused
      options:
        type: custom:media-player-glass-card
        label: Apple TV
        icon: mdi:apple
sort:
  method: state
```

## Installation

### HACS (recommended)

Add this repository as a custom repository in HACS (category: Dashboard), then
install "Media Player Glass Card".

### Manual

Copy `media-player-glass-card.js` into `<config>/www/`, then add it as a
Lovelace resource:

```yaml
resources:
  - url: /local/media-player-glass-card.js
    type: module
```

## License

MIT
