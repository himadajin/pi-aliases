# pi-aliases

Two command aliases for [Pi](https://github.com/earendil-works/pi).

| Command | Behavior |
| --- | --- |
| `/clear` | Starts a new session using `ctx.newSession()`. |
| `/exit` | Requests shutdown using `ctx.shutdown()`. |

Both commands reject arguments with an error notification. Trailing whitespace is allowed.

## Install

Install from this repository:

```sh
pi install git:github.com/himadajin/pi-aliases
```

Restart Pi, or run `/reload` in an existing session. Add `-l` to the install command to install for the current project only.

To try a local checkout without installing it, run from the repository root:

```sh
pi -e ./extensions/aliases.ts
```

This package uses `@earendil-works/pi-coding-agent` and is verified against Pi 1.1.0. It does not support the former `@mariozechner/pi-coding-agent` package. Pi loads the TypeScript extension directly; no build is required.

## Behavior

`/clear` respects cancellation by other extensions through Pi's session switching API. It does not add the success message displayed by the built-in `/new` command.

`/exit` exits immediately when Pi is idle. If Pi is processing work, it requests shutdown after that work settles, including queued work. The built-in `/quit` starts shutdown immediately.

If another extension registers `clear` or `exit`, Pi may rename the conflicting commands. Check command autocomplete for the available names.

## Development

```sh
npm install
npm run typecheck
npm test
```

Tests use Node's built-in test runner and TypeScript type stripping. The package is marked private to prevent accidental npm publication.
