# Source and adaptation

Inspected 2026-10-21: [dwzhu-pku/PaperBanana](https://github.com/dwzhu-pku/PaperBanana), commit `f1da3db8d5f4c3add947dfd3ddd93dddd3394dc3`.

Paper: Dawei Zhu, Rui Meng, Yale Song, Xiyu Wei, Sujian Li, Tomas Pfister and Jinsung Yoon, [PaperBanana: Automating Academic Illustration for AI Scientists](https://arxiv.org/abs/2601.23265).

Read README, `skill/SKILL.md`, `skill/run.py`, planner/stylist/visualizer/critic/retriever agents, the diagram style guide and diagram evaluation prompts. Source code carries Copyright 2026 Google LLC and Apache-2.0 licensing. The repository's skill frontmatter separately says MIT-0; this adaptation retains the repository's Apache license conservatively. See bundled LICENSE.

The original uses five agent roles, reference examples, image-generation models for diagrams and iterative visual critique. Its plot visualizer has a code-generation path. Its packaged skill depends on the whole repository, configured provider APIs and model calls; its default ten candidates and three critic rounds can multiply work.

This integration rewrites the workflow for the current Codex session. Changes: no provider APIs, no credential configuration, no mandatory separate agents, one candidate by default, reference retrieval proportional to the task, editable vector diagrams, direct data-to-code plotting, actual rendered-image inspection, bounded targeted revisions and preservation of valid outputs. Scientific fidelity, scope, readability, conciseness and visual coherence remain review dimensions. Keep useful legends rather than adopting the upstream critic's blanket legend removal.

These are implementation choices intended to reduce setup and repeated model work. They do not establish quality or speed superiority and have not been benchmarked against upstream PaperBanana. This bundle does not ship upstream inference code, models or PaperBananaBench examples. Revisit current source before adding upstream runtime support.
