---
name: flowcraft
description: Create and refine editable flowcharts, research method diagrams, scientific illustrations and data-driven figures from source material. Use for process explanations, paper figures, graphical abstracts or an explicit Flowcraft request. General app UI, animated explainers and routine cloud infrastructure diagrams use their specialized workflows.
license: Apache-2.0
---

# Flowcraft

Make the idea clear, preserve its meaning, and deliver editable sources plus a checked render. Use reference-guided composition and targeted visual revision. [Provenance](references/upstream.md) records the research foundations; this skill does not run or reproduce those systems' model pipelines.

## Adapt to the task and available capabilities

Use the user's selected model and effort. Choose tools from what the current session actually exposes; do not assume a named model, provider, image tool, subagent system or desktop-only helper exists. There are no fixed model roles or API credentials. Existing subscription tools and free local software are the intended route.

For a small figure, work directly. Add references, alternate compositions, structured intermediate data or independent review only when they can improve a material decision. Passes may be combined, skipped when unnecessary or revisited when a defect requires it. Do not spend extra calls merely to fill a pipeline. For unfamiliar complex work, check the available capability before choosing it. Report missing image inspection/export support without claiming the result was checked. Do not automatically change the selected model or switch to a billed service.

## Choose the representation

- **Editable diagrams:** SVG or another appropriate vector source. Give substantial figures stable IDs for panels, modules, labels and directed connections. Meaningful `<title>` and `<desc>` elements help later edits. See [revisions](references/revisions.md) for complex or multi-turn work.
- **Quantitative figures:** code driven by actual data, units and transformations; read [plot guidance](references/plots.md). Use an available plotting library when needed, or SVG for a simple chart. Never use an image model to invent numerical marks.
- **Pictorial illustrations:** an available subscription image tool can help; follow its actual tool/skill instructions. Keep exact labels and data overlays editable where feasible. Preserve the user's requested medium and sources.

Call output **vector** when it consists of vector objects/text, **hybrid** when editable objects contain raster illustrations, and **raster** when it is a pixel image. A bitmap inside SVG is not object-editable artwork. Use the actual requested writer/exporter for PPTX, draw.io, TeX or other formats; renaming a file is not conversion.

## Build and verify

1. **Ground the content.** Read the source, caption, data and supplied figure. Identify the intended message, required entities and relationships, branching/feedback and known versus unknown facts. Distinguish training from inference when relevant. Ask only when ambiguity changes meaning. Mark illustrative assumptions; never invent results or missing scientific relationships.
2. **Compose the argument.** Inspect supplied references first; retrieve primary examples only when they help a real layout or convention decision. Extract visual organization, not scientific claims or unlicensed artwork. Choose a composition suited to the content. Keep captions outside artwork unless requested inside. For substantial figures, keep a compact source-to-element map beside the editable master.
3. **Make it legible.** Follow the user's template or venue. Otherwise use restrained semantic color, readable type, consistent strokes and clear grouping. Labels/shapes should reinforce color distinctions. Use concise labels and necessary legends; optimize at actual placed size rather than only a zoomed preview.
4. **Inspect the actual result.** Render the current source, open the fresh output and compare it with source facts and requirements. Prioritize fidelity, complete arrow paths, data accuracy and text before aesthetic polish. Check clipping, overlap, contrast, fonts and final-size readability. Numeric checks and visual inspection serve different purposes; neither replaces the other. Inspect exported PDFs separately when requested.
5. **Refine concrete defects.** Repair the relevant components and recheck the whole figure. Keep accepted decisions across turns and record superseded requirements in a compact ledger for multi-turn work. Compare with the last accepted version; preserve it until the replacement passes. Stop when requirements are met or further attempts add no useful evidence, not at a fixed self-score or arbitrary number of rounds.

## Export and handoff

For bundled local SVG audit, PNG rendering and basic vector PDF export, read [export tools](references/exports.md). These tools are optional implementation aids; a better available renderer is acceptable if its actual output is verified. SVG remains the editable master. A successful structural check is not evidence of correct science, valid glyphs or a good layout.

Deliver the figure and editable source, plus a short caption/alt description where helpful. For plots include generating code and source data or a stable input reference. State material assumptions and unavailable checks. Avoid universal quality, future compatibility or publication-readiness claims from a narrow example. Keep license/source attribution with supporting files. Publishing or submission follows user authorization.
