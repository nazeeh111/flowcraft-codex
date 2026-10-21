# Local audit and export tools

Replace `SKILL_DIR` with this skill's actual directory. Node.js 20.9+ and the pinned packages in package-lock.json are required. If missing, run `npm ci` in the skill folder or use an already available suitable renderer. Do not change a shared runtime. If Node is absent from PATH, locate an installed binary using ordinary environment discovery; a desktop session may also expose `load_workspace_dependencies`.

```sh
node SKILL_DIR/scripts/svg.cjs figure.svg
node SKILL_DIR/scripts/render_svg.cjs figure.svg preview-v2.png --width 2103
node SKILL_DIR/scripts/export_pdf.cjs figure.svg figure-v2.pdf --width-mm 178
```

Helpers make no model calls, reject active/external resources, duplicate IDs and missing local references, and refuse existing destinations. PNG output is bounded to 12000 pixels per side and 40 million total pixels. This is structural validation, not an untrusted-input sandbox or a visual/semantic quality verdict. Inspect authored/imported SVG before use.

Use fresh versioned outputs. PNG export preserves the SVG's authored background/transparency. The basic PDF exporter retains vector geometry/text but rejects filters, masks, patterns and style sheets and fails on reported unsupported content rather than silently flattening it. Use simpler inline styles or another available vector exporter for those features. Font substitution and complex mathematical/non-Latin glyphs can differ. Inspect the exported PDF's actual pixels, text, paths and clipping. Embedded raster assets stay raster in a hybrid PDF.

Choose physical size and resolution from the requested placement. Raster width in pixels = width in mm / 25.4 × required DPI. A 178 mm-wide figure needs about 2103 pixels for 300 DPI; neither value is a universal publication requirement. Do not infer sufficient detail from a DPI metadata field.
