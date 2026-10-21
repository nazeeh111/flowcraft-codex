<p align="center">
  <img src="assets/hero.png" alt="Flowcraft: make the idea clear. Editable diagrams and scientific figures for Codex." width="100%" />
</p>

<p align="center">
  <a href="https://github.com/nazeeh111/flowcraft-codex/actions/workflows/test.yml"><img src="https://github.com/nazeeh111/flowcraft-codex/actions/workflows/test.yml/badge.svg" alt="Verification status" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache--2.0-blue" alt="Apache 2.0 license" /></a>
  <a href="https://github.com/nazeeh111/flowcraft-codex/releases/latest"><img src="https://img.shields.io/github/v/release/nazeeh111/flowcraft-codex" alt="Latest release" /></a>
</p>

# Flowcraft

**Clear diagrams. Faithful figures. Sources you can keep editing.**

Flowcraft gives Codex a focused workflow for flowcharts, method diagrams and scientific figures: understand the source, compose the argument, render the result and repair what the viewer actually sees. It works in your existing Codex session with your selected model and tools.

No separate model API key, provider wrapper or background service. Local SVG, PNG and basic vector PDF tools use free open-source libraries. Your normal Codex subscription limits still apply.

[Install](#install) · [Try it](#try-it) · [Examples](#examples) · [How it adapts](#built-for-changing-models-and-tools) · [Evidence](docs/validation.md)

## Install

Requires Node.js 20.9+ with npm, Python 3 and Codex with local file execution. Dependencies are pinned; `npm ci` downloads free packages for your platform.

```sh
git clone https://github.com/nazeeh111/flowcraft-codex.git
cd flowcraft-codex
npm ci
python3 scripts/install.py
```

The installer copies Flowcraft and its dependencies into `~/.codex/skills/flowcraft` (or `$CODEX_HOME/skills/flowcraft` when configured). It refuses existing destinations. To use another skill root, pass `--dest /your/skill-root/flowcraft`.

Flowcraft is normally available on the next turn. Restart Codex if its skill list has not refreshed. It can be selected automatically for relevant figure requests or explicitly as `$flowcraft`.

**Upgrading from the former name?** Back up and move `~/.codex/skills/paperbanana` outside your active skill roots, then install Flowcraft. This preserves local edits and prevents duplicate skill selection. For any later upgrade, preserve the existing Flowcraft directory before installing. Restore that backup to roll back. Reinstall dependencies on each operating system; do not transfer `node_modules` across platforms.

## Try it

> Use $flowcraft to turn these methods and this caption into an editable scientific figure. Deliver SVG and PDF, and inspect the rendered result.

> Use $flowcraft to diagram this decision process. Make both branches explicit, keep the labels short, and provide an editable source and PNG.

> Revise this figure to use a monochrome style. Preserve the accepted labels, panel structure and all relationships. Compare the new render with the previous version.

| You bring | Flowcraft helps produce |
|---|---|
| A method section and caption | Source-grounded modules, connections and panels |
| A process or decision | A readable flowchart with explicit paths |
| Data and a visual question | Code-derived marks with units and editable exports |
| An existing figure and feedback | Targeted edits that retain accepted decisions |
| A pictorial concept | An appropriate vector or subscription-assisted hybrid/raster route |

## Examples

The examples include their source brief and synthetic data. They demonstrate concrete output paths, not empirical research results or a quality benchmark.

### A decision with every branch explicit

![Sensor validation and confidence decision flow](examples/rendered/decision-flow.png)

[Editable SVG](examples/rendered/decision-flow.svg) · [Source and revision check](examples/brief.md#decision-flow-and-revision)

### A method with distinct training and inference paths

![Editable sequence classification example](examples/rendered/method.png)

[SVG](examples/rendered/method.svg) · [PDF](examples/rendered/method.pdf) · [Source and caption](examples/brief.md)

### A plot derived directly from its data

![Synthetic latency plot](examples/rendered/plot.png)

[SVG](examples/rendered/plot.svg) · [PDF](examples/rendered/plot.pdf) · [Data](examples/data.json) · [Generator](examples/generate.cjs)

## Built for changing models and tools

Flowcraft does not hardcode model names, fixed agent roles, self-scoring thresholds or mandatory round counts. It uses the user's chosen model and available capabilities, keeps small requests direct, and adds references, alternate compositions or review only when they help a material decision.

The stable requirements are about the outcome: preserve the source, make the visual legible, inspect actual exports and retain accepted decisions. Better available tools can replace the bundled helpers. Missing capabilities are reported honestly; there is no automatic paid-provider fallback.

This keeps the workflow adaptable. It does not guarantee compatibility with every future model, tool or SVG feature, and model reasoning quality still matters.

## Export tools

```sh
node scripts/svg.cjs figure.svg
node scripts/render_svg.cjs figure.svg preview-v2.png --width 2103
node scripts/export_pdf.cjs figure.svg figure-v2.pdf --width-mm 178
```

SVG is the editable master. PNG is a raster export. The PDF exporter retains basic vector geometry/text, while embedded bitmap illustrations remain raster assets in a hybrid figure. Merely placing a PNG inside SVG does not make its objects editable.

Helpers refuse existing outputs, reject external/active SVG resources, validate internal references and bound raster dimensions. They are structural checks, not a hostile-file sandbox or a scientific-quality verdict. PDF support is deliberately limited: filters, masks, patterns and style sheets need another exporter or simpler inline SVG; font substitution and complex glyphs require inspecting the actual PDF. See [export details](references/exports.md).

## Verification

```sh
npm test
npm run examples
```

Tests cover actual PNG content, coordinate fidelity, file preservation, invalid/external resources, raster bounds, hybrid classification and basic vector PDF structure/size. Each run uses fresh temporary folders. Examples produce SVG, PNG and PDF without model calls.

[Validation scope and observed results](docs/validation.md) · [Research comparison](docs/comparison.md) · [Skill instructions](SKILL.md)

## Foundations and license

Flowcraft is an independent synthesis informed by [PaperBanana](https://github.com/dwzhu-pku/PaperBanana) and related research on reference-guided composition, semantic graphics and iterative visual editing. It does not ship those systems' inference pipelines, models or benchmark figures, or claim their benchmark scores. Attribution and the comparison remain available in [provenance](references/upstream.md) and [NOTICE](NOTICE).

Apache-2.0. See [LICENSE](LICENSE). Not affiliated with or endorsed by the cited projects.
