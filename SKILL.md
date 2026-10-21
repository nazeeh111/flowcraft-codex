---
name: paperbanana
description: Create and refine academic method diagrams, scientific illustrations and data-driven paper figures using PaperBanana's reference-guided planning and visual critique. Use for publication figures, architecture figures in research papers, graphical abstracts or an explicit PaperBanana request. Routine app UI, general software architecture diagrams and animations use their own workflows.
license: Apache-2.0
---

# PaperBanana for Codex

Turn scientific content and a figure's intended message into a faithful, legible figure, then inspect the rendered result. This is a Codex-native adaptation of PaperBanana, not its API pipeline or a reproduction of its benchmark results. See [provenance](references/upstream.md) for inspected source and changes.

Use current Codex reasoning and available subscription tools. No provider keys, API wrappers, background service or upstream environment are needed. Do not run upstream `skill/run.py` or install its requirements for this workflow.

## Choose the output

- For exact labels, module relationships and editable paper diagrams, author SVG or another appropriate editable vector format. Use the local renderer below for a PNG preview.
- Call an output **vector** when its visual objects are vectors and text, **hybrid** when editable objects include embedded raster illustrations, and **raster** when it is a pixel image. Wrapping a PNG in SVG does not make its contents editable. For complex figures, use stable IDs for panels, modules, labels and connections, and meaningful `<title>`/`<desc>` elements; read [revision guidance](references/revisions.md) for multi-turn edits, raster reconstruction and local repairs.
- For quantitative figures, read [plot guidance](references/plots.md). Generate marks from actual data using code, preserving values, units and transformations. A simple plot can use SVG; use an available plotting library for complex statistics.
- For pictorial scientific illustrations that benefit from generated pixels, use an available subscription image tool and its imagegen skill. Keep exact labels and quantitative overlays editable where feasible. If unavailable, use a suitable vector illustration or explain the limitation; do not switch to billed APIs.
- Preserve the requested medium and existing source when refining a figure. Use other available document, slide, 3D or animation workflows only when the deliverable requires them.

## Reference, plan, style, render, critique

These are reasoning passes, not a requirement to launch five agents. Combine them for simple work. Start with one candidate; explore alternatives only when composition is genuinely uncertain or the user requests them.

1. **Ground the figure.** Read the provided methods, caption, data and existing image. Identify the main claim, required entities, directed relationships, training versus inference, known quantities, and unknowns. Ask only when missing information changes scientific meaning. Mark illustrative assumptions; never invent results or modules. Choose a sensible size if unspecified.
2. **Retrieve useful references.** Inspect supplied references first. When useful, find a small number of structurally relevant figures from primary papers or the user's collection and inspect the actual figures. Extract layout, grouping and visual conventions, not scientific claims. Record sources briefly. If references are unavailable, state that and proceed from source content; do not claim benchmark retrieval occurred. Do not download a benchmark by default.
3. **Plan the visual argument.** Map source facts to nodes, edges, panels and labels. Choose a pipeline, loop, layered architecture or other composition suited to the method. Separate training-only elements from inference and label feedback paths. Put the caption outside the artwork unless requested inside. For substantial figures, save a compact source-to-element map and design brief beside the source; do not create paperwork for trivial figures.
4. **Apply a consistent style.** Follow supplied venue/template requirements. Otherwise use a white background, dark readable type, restrained semantic colors, consistent strokes and intentional whitespace. Use short labels and visual grouping. Keep necessary legends. Check readability at the intended physical size; distinguish categories through labels or shapes as well as color. Treat upstream's conference-specific aesthetics as examples, not universal rules.
5. **Render and critique the pixels.** Open the fresh render and compare it with the original source and caption. Check scientific fidelity first, then text and arrow directions, scope, clipping, overlaps, contrast, legibility and unnecessary detail. For plots, verify numeric values separately from appearance. Fix concrete defects and render again. Usually one or two targeted passes suffice; stop when requirements are met or further attempts stop improving evidence. Preserve the last valid version until its replacement succeeds. A successful render is not a scientific or visual QA pass.

For revisions, preserve scientific content, panel identity and previously accepted changes unless the user supersedes them. Keep a compact requirements ledger for multi-turn work, recording current and superseded decisions. Compare each new render against the source, accumulated requirements and last accepted figure. Review the whole figure after a local edit, since moving one label can obstruct another connection. See [revision guidance](references/revisions.md).

## Local SVG rendering

Run from any working directory, replacing `SKILL_DIR` with this skill's actual absolute path:

```sh
node SKILL_DIR/scripts/render_svg.cjs figure.svg figure-preview.png --width 1800
```

The helpers use pinned free dependencies from this skill's `package-lock.json`. If dependencies are missing, run `npm ci` in this skill directory, or use an already available suitable renderer. They make no model calls. They reject active/external resources, broken local references and duplicate IDs, and refuse to replace an output. PNG dimensions are bounded. These are structural checks, not an untrusted-input sandbox or a visual correctness verdict. Choose a new versioned name. If Node is absent from PATH, use the Node executable returned by `load_workspace_dependencies`. Do not modify a shared runtime.

SVG remains the editable master. For a vector PDF of basic SVG, run:

```sh
node SKILL_DIR/scripts/export_pdf.cjs figure.svg figure.pdf --width-mm 178
```

The PDF exporter fails on reported unsupported content rather than flattening it to an image; filters, masks, patterns and style sheets need another exporter or simpler inline SVG. Font substitution can differ, especially for mathematics and non-Latin text. Inspect the actual PDF and compare labels, markers and clipping with the SVG/PNG. Do not claim a hybrid source becomes pure vector through PDF export. Size raster exports for actual placement: pixels = width in mm / 25.4 × required DPI. Verify venue requirements rather than imposing 178 mm universally.

## Deliver

Provide the figure, its editable source and a short caption or alt description when helpful. State what was visually inspected and any material scientific assumptions or unavailable checks. Keep provenance with supporting files rather than cluttering the artwork. Do not claim publication readiness, upstream execution or quality superiority from a single example. Publishing and submission require the user's authorization.
