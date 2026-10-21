# Quantitative figures

Keep original data separate from presentation. Load data from its supplied file rather than manually retyping points into a prose prompt. Derive plotted arrays, summary statistics and labels in code so edits cannot silently desynchronize them.

Before plotting, check required columns, numeric validity, units, missing values, duplicate identifiers and expected sample counts. Decide whether missing values should be excluded, shown as gaps or treated differently based on the data's meaning. Do not silently drop rows. Do not invent data when only a method section is supplied; offer a schematic or clearly labeled illustrative data if appropriate.

Choose an honest visual encoding: bars normally need a zero baseline; explain meaningful axis truncation elsewhere. Use log axes only for appropriate positive data. Identify the meaning of error bars, replicates and aggregation. Do not turn a standard deviation into a confidence interval or infer significance from overlapping intervals. Record derived transformations, filters and uncertainty definitions.

Use the project's available plotting environment first. For a simple chart, code-generated SVG can preserve every numerical coordinate without extra packages. For statistical or multi-panel charts, use Matplotlib or another suitable available library. The local scientific-python skill supplies numerical computing, not necessarily plotting. Verify imports; if needed use an isolated task-local environment with free dependencies instead of upgrading a shared environment. Never execute code copied from a paper or retrieved page without inspecting it.

Save the generating code, input or stable input reference, vector figure when supported and a fresh PNG preview. Check plotted series counts and representative coordinates against raw data, then inspect labels, scales, legends and uncertainty at final size. A plot produced from synthetic validation data must be labeled as a demonstration, never a research result.
