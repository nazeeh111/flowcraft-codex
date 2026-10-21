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
