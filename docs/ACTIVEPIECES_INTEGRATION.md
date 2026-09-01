# Token Calculator Activepieces integration

Status: implementation started on 2026-09-01. The source package builds, its seven unit tests pass, its runtime metadata loads, and `npm pack --dry-run` succeeds.

## Verified distribution decision

Activepieces has temporarily paused unsolicited pull requests from people outside its organization. Those PRs are automatically closed unless the contributor is already coordinating with Activepieces and receives a keep-open label.

The supported independent route is a public npm piece:

1. Build the piece as its own npm package.
2. Publish it publicly under the owner's npm scope.
3. Users install the package from **Settings → My Pieces → Install Piece**.

For Token Calculator, the package name is:

```text
@jay0073/piece-tokencalculator
```

The generic “feel free to open a pull request” callout in the piece-building tutorial is currently superseded by the repository's more specific contribution policy.

## What is implemented

The package lives in `packages/activepieces-tokencalculator` and has no authentication requirement or TokenCalculator server dependency.

Actions:

- **Count Tokens** — mapped text, text/source files, and supported images for one selected model.
- **Estimate Cost** — input, cached-input, and expected output cost for one model.
- **Compare Models** — side-by-side results for selected models, including cheapest model and lowest token count.

Supported text/source files:

```text
txt md markdown json csv js jsx ts tsx py go rs java c cpp h hpp
css html xml yaml yml toml sql sh log
```

Supported images:

```text
png jpg jpeg gif webp
```

Files are limited to 10 MB. Text decoding and image-dimension parsing happen inside the Activepieces runtime. No workflow content is sent to TokenCalculator.dev.

## Local verification

From the Token Calculator repository:

```bash
npm run test:activepieces
npm run build:activepieces
npm run pack:activepieces
```

The public npm registry currently exposes `@activepieces/pieces-framework` `0.32.0`, even though the Activepieces main branch identifies its workspace framework as `0.36.0`. The source package is therefore tested against the publicly resolvable `0.32.0` contract.

Activepieces' newest publishing script creates a self-contained bundle and removes Activepieces workspace dependencies before publishing. Before the production npm release, run the package through the matching Activepieces fork/tooling and publish the generated `dist` artifact. Do not submit it as an unsolicited PR.

## Activepieces platform steps

After the npm release:

1. Sign in to the Activepieces instance.
2. Open **Settings**.
3. Open **My Pieces**.
4. Select **Install Piece**.
5. Enter `@jay0073/piece-tokencalculator` and install it.
6. Create a new flow and add a trigger such as **Manual Trigger**.
7. Add **Token Calculator** and choose **Count Tokens**.
8. Put static text in **Text**, or map text from the trigger/previous step. A file from a prior step can be mapped into **File**.
9. Select a model and test the step. Confirm that `result.inputTokens`, `result.cost`, and `result.context` appear.
10. Repeat with **Estimate Cost** and **Compare Models**, then publish the flow.

For a private piece on an eligible Activepieces edition, build a custom piece tarball and upload it from **Platform Admin → Pieces** instead of using npm.

## Release steps

1. Copy or generate the piece in a compatible Activepieces fork so its official piece bundler can produce the self-contained artifact.
2. Run the piece-specific build and tests.
3. Authenticate to npm with the `@jay0073` account.
4. Confirm that the version is unused:

```bash
npm view @jay0073/piece-tokencalculator version
```

5. Publish the generated Activepieces `dist` package with public access.
6. Install the exact package from **My Pieces** and execute all three actions in a real flow before announcing it.

## Official references

- [Build pieces overview](https://www.activepieces.com/docs/build-pieces/building-pieces/overview.md)
- [Create a piece definition](https://www.activepieces.com/docs/build-pieces/building-pieces/piece-definition.md)
- [Create an action](https://www.activepieces.com/docs/build-pieces/building-pieces/create-action.md)
- [Publish a community piece on npm](https://www.activepieces.com/docs/build-pieces/sharing-pieces/community.md)
- [Share a private piece](https://www.activepieces.com/docs/build-pieces/sharing-pieces/private.md)
- [Current repository contribution policy](https://github.com/activepieces/activepieces/blob/main/CONTRIBUTING.md)
