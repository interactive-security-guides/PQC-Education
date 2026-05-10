# Post-Quantum Cryptography — Interactive Demo

> **A cinematic, browser-based explainer that turns one of the most consequential shifts in modern security into something anyone can understand in under 10 minutes.**

---

## What Is This?

This is a self-contained interactive kiosk that walks visitors through the quantum cryptography threat, and the industry's response to it, across **seven narrative scenes**. No logins. No installs. No frameworks. Open an HTML file in a browser and go.

It was built for a non-technical audience: executives, policy makers, customers curious about where security is headed. Every scene is designed to build intuition, not overwhelm with math.

---

## The Story It Tells

Each scene is a standalone chapter. Together they form a complete arc; from "here's how encryption works today" to "here's what breaks it, here's who's already exploiting that, and here's the solution the world just standardized."

| Scene | Title | What You'll Learn |
|-------|-------|-------------------|
| 01 | **The Vault** | How RSA and ECC lock your data today and why that lock is time-limited |
| 02 | **Shor's Algorithm** | Step-by-step: how a quantum computer uses period-finding to factor large numbers and shatter RSA |
| 03 | **Harvest Now, Decrypt Later** | Nation-state actors are already collecting encrypted traffic to decrypt once quantum arrives |
| 04 | **The Lattice Wall** | The new math that quantum computers *can't* speed up — and how NIST's PQC standards are built on it |
| 05 | **PQC Benchmark Panel** | Side-by-side: RSA-2048 vs ECDSA vs Kyber-768 vs Dilithium-3 — key sizes, speed, quantum resistance |
| 06 | **Consequence Map** | Radial cascade of what breaks the day a cryptographically-relevant quantum computer arrives |
| 07 | **The Encryption Surface** | Where encryption lives in a modern enterprise, and what a migration actually looks like |

---

## Why This Exists

The quantum computing threat to public-key cryptography is real, well-documented, and already driving government mandates (NIST FIPS 203/204/205/206, NSA CNSA 2.0, OMB M-23-02). But most explanations are either too academic to land with decision-makers or too vague to be actionable.

This demo was built to close that gap — to give anyone who runs through it a *genuine, defensible understanding* of:

- Why today's encryption (RSA, ECC) is vulnerable to quantum attack
- Why the threat is **now**, not hypothetical — "Harvest Now, Decrypt Later" attacks are active
- What Post-Quantum Cryptography actually is and how it works
- What NIST finalized in August 2024 and what it means for your organization

---

## Running It

No build step. No server required.

```bash
git clone https://github.com/0xd1g5/quantum-education-and-demo.git
cd quantum-education-and-demo
open navigation_shell.html   # macOS
# or: xdg-open navigation_shell.html  (Linux)
# or: just double-click the file in Finder / Explorer
```

Start at `navigation_shell.html` and click through the scenes in order for the full narrative experience. Each scene can also be opened independently.  Ensure you are running all scenes from the same directory.

**Recommended viewport:** 1060 × 760 (kiosk/presentation). Works in any modern browser.

---

## Design

The visual language is intentional. A dark, high-contrast interface signals seriousness; this isn't a toy explainer. The color system carries semantic meaning throughout every scene:

| Color | Meaning |
|-------|---------|
| Blue `#2a9fd6` | Classical / currently safe |
| Red-orange `#ff5500` | Quantum threat |
| Green `#00e87a` | Quantum-safe / PQC solution |

Typography: **Bebas Neue** for headers · **Rajdhani** for body · **Inconsolata** for labels and data values.

Light/dark mode toggle is available in every scene header. Preference persists across scenes.

---

## What's Inside

```
navigation_shell.html          ← Start here
scene1_vault_interactive.html
scene2_shors_interactive.html
scene3_HND_interactive.html
scene4_lattice_interactive.html
scene5_benchmark_interactive.html
scene6_consequence_map_interactive.html
scene7a_encryption_surface_interactive.html   ← Kiosk version
scene7b_encryption_surface_exec_interactive.html  ← Exec briefing version
shared/
  theme.css          ← Light/dark mode overrides
  theme-toggle.js    ← Preference persistence, no-flash init
```

Pure HTML, CSS, and vanilla JavaScript. No dependencies.

---

## License

[MIT](LICENSE) — use it, adapt it, run it.

---

*Built to make the quantum threat legible — because the organizations that understand it earliest will be the ones best positioned to respond.*
