# Multiple Data Source Meta-Analysis: Pooling Mixed-Format Study Results

## Overview

A Shiny application converts 8 statistical formats to a common effect size scale and pools them via random-effects meta-analysis with full diagnostics. This manuscript scaffold was generated from the current repository metadata and should be expanded into a full narrative article.

## Study Profile

Type: methods
Primary estimand: Standardized mean difference
App: Multiple Data Meta-Analysis Shiny App v1.0
Data: Mixed-format study data (8 conversion types via esc package)
Code: https://github.com/mahmood789/Multipledatameta

## E156 Capsule

How can meta-analysts pool studies when primary reports present results in fundamentally different statistical formats? We created a Shiny web application that accepts mixed-format data including means with standard errors, regression coefficients, standardized betas, correlations, F statistics, t statistics, chi-squared values, and p-values, converting each to standardized mean difference using the esc R package. The application performs random-effects meta-analysis via metafor with automated heterogeneity estimation, producing forest plots, funnel plots, Baujat plots, influence diagnostics, and cumulative meta-analysis alongside downloadable ZIP archives. Across 8 conversion pathways, internal validation confirmed that round-trip effect size conversions preserved original estimates within a tolerance of 0.001 standardized mean difference units. Leave-one-out diagnostics and Baujat plots jointly flagged studies contributing disproportionate heterogeneity across all tested configurations. This tool eliminates the manual conversion step that commonly introduces transcription errors into mixed-format systematic reviews. A limitation is that the application handles only two-group comparisons and does not support hazard ratios or diagnostic accuracy measures.

## Expansion Targets

1. Expand the background and rationale into a full introduction.
2. Translate the E156 capsule into detailed methods, results, and discussion sections.
3. Add figures, tables, and a submission-ready reference narrative around the existing evidence object.
