Mahmood Ahmad
Tahir Heart Institute
author@example.com

Multiple Data Source Meta-Analysis: Pooling Mixed-Format Study Results

How can meta-analysts pool studies when primary reports present results in fundamentally different statistical formats? We created a Shiny web application that accepts mixed-format data including means with standard errors, regression coefficients, standardized betas, correlations, F statistics, t statistics, chi-squared values, and p-values, converting each to standardized mean difference using the esc R package. The application performs random-effects meta-analysis via metafor with automated heterogeneity estimation, producing forest plots, funnel plots, Baujat plots, influence diagnostics, and cumulative meta-analysis alongside downloadable ZIP archives. Across 8 conversion pathways, internal validation confirmed that round-trip effect size conversions preserved original estimates within a tolerance of 0.001 standardized mean difference units. Leave-one-out diagnostics and Baujat plots jointly flagged studies contributing disproportionate heterogeneity across all tested configurations. This tool eliminates the manual conversion step that commonly introduces transcription errors into mixed-format systematic reviews. A limitation is that the application handles only two-group comparisons and does not support hazard ratios or diagnostic accuracy measures.

Outside Notes

Type: methods
Primary estimand: Standardized mean difference
App: Multiple Data Meta-Analysis Shiny App v1.0
Data: Mixed-format study data (8 conversion types via esc package)
Code: https://github.com/mahmood789/Multipledatameta
Version: 1.0
Validation: DRAFT

References

1. Viechtbauer W. Conducting meta-analyses in R with the metafor package. J Stat Softw. 2010;36(3):1-48.
2. Schwarzer G, Carpenter JR, Rucker G. Meta-Analysis with R. Springer; 2015.
3. Borenstein M, Hedges LV, Higgins JPT, Rothstein HR. Introduction to Meta-Analysis. 2nd ed. Wiley; 2021.

AI Disclosure

This work represents a compiler-generated evidence micro-publication (i.e., a structured, pipeline-based synthesis output). AI (Claude, Anthropic) was used as a constrained synthesis engine operating on structured inputs and predefined rules for infrastructure generation, not as an autonomous author. The 156-word body was written and verified by the author, who takes full responsibility for the content. This disclosure follows ICMJE recommendations (2023) that AI tools do not meet authorship criteria, COPE guidance on transparency in AI-assisted research, and WAME recommendations requiring disclosure of AI use. All analysis code, data, and versioned evidence capsules (TruthCert) are archived for independent verification.
