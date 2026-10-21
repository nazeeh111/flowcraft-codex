# Example sources

These demonstrations validate exports and a small source-to-figure mapping. They do not establish general scientific correctness or figure quality superiority.

## Method source

A sequence is encoded, mean-pooled and classified. During training, predictions and true labels feed a loss. That loss updates both encoder and classifier parameters. Inference uses only the input → encoder → pooling → classifier forward path.

Correspondence: module-input, module-encoder, module-pool and module-classifier are forward stages. module-loss is training only. edge-prediction-loss and edge-label-loss supply its inputs. edge-update-encoder and edge-update-classifier are explicitly dashed updates, not inference flow.

Caption: Sequence classification with a separate training loss. Dashed arrows show parameter updates.

## Plot source

`data.json` holds explicitly synthetic renderer-validation points. `generate.cjs` derives every mark's coordinate directly from them with a linear zero-based y scale in milliseconds. No aggregation, uncertainty bars or inferred statistical conclusions are involved.

Caption: Synthetic latency values for four sample positions, used only to verify rendering and coordinate fidelity.

Run `npm run examples` to generate a fresh temporary directory, or `node examples/generate.cjs /new/output/folder` to select a destination. Existing filenames are refused.

## Decision flow and revision

A separate behavioral check used: sensor readings are validated; valid readings feed a feature extractor and classifier; invalid readings go to manual review; classifier confidence below a threshold also goes to manual review, otherwise the predicted label is emitted. No numeric threshold is specified or invented. Equality emits under the stated otherwise condition.

`rendered/decision-flow.svg` and `.png` are the accepted monochrome revision. The original source-to-figure requirements and all seven relationships were retained, with only fill colors changed. This was visually inspected independently; it is an example, not a general behavioral benchmark.
