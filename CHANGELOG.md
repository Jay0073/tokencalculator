# Changelog

All notable changes to TokenCalculator.dev and its companion packages are documented here.

This project follows [Semantic Versioning](https://semver.org/) for published npm packages and uses the structure recommended by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Detailed n8n and Activepieces integration documentation with workflow examples, diagrams, troubleshooting, FAQs, and related-document links.
- Expanded API, text, file, image, and privacy documentation.
- A responsive, asymmetric documentation index.
- Shared multi-file handling for workflow integrations.

### Changed

- Documentation FAQs now use the same accessible accordion interface as the main site.
- Documentation callouts and examples now use neutral borders and consistent styling.

## Published packages

The repository currently maintains these independently versioned npm packages:

| Package | Current version | Purpose |
| --- | ---: | --- |
| [`@jay0073/tokencalculator-core`](./packages/tokencalculator-core) | 0.3.0 | Shared local token measurement, model comparison, context-window, image, and cost APIs. |
| [`@jay0073/n8n-nodes-tokencalculator`](./packages/n8n-nodes-tokencalculator) | 0.1.5 | Token counting and cost comparison inside self-hosted n8n workflows. |
| [`@jay0073/piece-tokencalculator`](./packages/activepieces-tokencalculator) | 0.1.1 | Token counting and model comparison actions for Activepieces. |

Earlier releases predate the repository changelog. Their package versions and Git history remain the authoritative historical record. Future releases will receive individual entries here.

[Unreleased]: https://github.com/Jay0073/tokencalculator/commits/master
