# Validation and limits

Release checks run on macOS with Node.js 24.14.0 and Python 3.14. The renderer uses the pinned npm dependencies in `package-lock.json`. Linux/Windows behavior has not been observed locally; the package uses portable APIs and dependencies supporting those platforms, but this release does not claim cross-platform execution proof.

## Automated checks

- PNG export verifies expected dimensions and a known pixel color.
- Existing outputs remain byte-for-byte intact on refused writes.
- Malformed XML, duplicate IDs, missing references, remote/relative CSS resources, entity-encoded external hrefs, active handlers, scripts and document types are rejected without creating output.
- Projected raster dimensions/pixel count are checked before rendering.
- Local gradient/marker references remain allowed; embedded bitmap assets are labeled hybrid.
- Basic PDF output is a valid PDF with expected physical page dimensions and no image objects in the vector fixture. Unsupported tested SVG features fail without a partial destination.
- Examples run in fresh directories; plotted coordinates are compared to original synthetic data. The method includes explicit loss inputs and separate updates to encoder and classifier.

Run `npm test` to reproduce. Tests are concrete renderer/format checks, not mocked model tests, scientific correctness evaluations or a benchmark against other systems.

## Manual checks

Completed before v1.0.0: 20 automated tests passed; a fresh installation rendered successfully; reinstall refusal preserved all installed bytes. The prior local skill was backed up and restored into a separate recovery destination with byte-identical comparison before the update.

Current-source method and plot PNGs were visually inspected. Independent review rendered and inspected the method PDF and compared its labels, loss inputs and two distinct parameter-update paths with the PNG and source brief. PDF text extraction preserved required method labels and all four plot values; each PDF had one page at the selected 178 mm width. Both PDF previews were rendered and visually inspected. These observations apply to the included examples, not arbitrary future figures.

For new work, inspect fresh PNGs for label readability, clipping and connection directions. Inspect PDFs separately because fonts/markers can differ. Verify source/figure mapping and retained text. The publication brief is in `examples/brief.md`; plot values are synthetic and never represented as empirical findings.

## Deliberate limits

The SVG structural audit does not measure all overlaps, clipping, glyph coverage, accessibility or semantic correctness. It is not an untrusted-content sanitizer. PDF export supports a basic SVG subset and font substitution can change text; unsupported features require another verified exporter. Automated overlap correction, OCR, model segmentation, full raster vectorization, arbitrary PPTX/draw.io conversion and local image-model inference are not bundled. The skill routes to suitable existing capabilities when they are actually available, and reports missing capabilities honestly.

No held-out model evaluation was run. No guarantee of perfect figures, universal editability, publication acceptance or quality superiority is made. Meaningful quality claims require inspecting actual content and measuring the relevant outcome.

## Flowcraft v2.0.0

The renamed package adds three installer tests to the 20 renderer checks. The new tests reproduce a macOS parent-path alias issue (`/var` versus `/private/var`) in source-nesting checks; normalizing the destination after refusing destination symlinks fixes it. Installer tests cover copying runtime material, excluding checkout files, refusing existing work/symlinks, source nesting and missing dependencies. `CODEX_HOME` is honored for the default installation root.

A fresh independent behavioral check used the Flowcraft skill to create a sensor-validation decision diagram and then revise it to monochrome. Both PNGs were opened. All seven required relationships, text, IDs, element structure and non-fill attributes were retained across the revision. The monochrome result is included in examples/rendered/decision-flow.svg and .png. No numeric threshold was invented. This bounded task supports the observed revision behavior; it does not establish general or future-model superiority.

The entrypoint now routes export-specific details to a conditional reference, uses capability-based tool selection, and avoids named model roles, forced agent counts, fixed refinement rounds and self-scoring thresholds. These design choices improve adaptability; future tool/runtime changes still require compatibility checks.
