import assert from "node:assert/strict";
import { test } from "node:test";
import registerAliases from "../extensions/aliases.ts";

function setup(newSession = async () => ({ cancelled: false })) {
  const commands = new Map();
  const notifications = [];
  const calls = [];

  registerAliases({
    registerCommand(name, command) {
      commands.set(name, command);
    },
  });

  const ctx = {
    ui: {
      notify(message, type) {
        notifications.push({ message, type });
      },
    },
    async newSession() {
      calls.push("newSession");
      return newSession();
    },
    shutdown() {
      calls.push("shutdown");
    },
  };

  return { commands, ctx, calls, notifications };
}

test("arguments cannot trigger session switching or shutdown", async () => {
  for (const name of ["clear", "exit"]) {
    const { commands, ctx, calls, notifications } = setup();
    await commands.get(name).handler(" unexpected ", ctx);
    assert.deepEqual(calls, []);
    assert.equal(notifications.length, 1);
    assert.equal(notifications[0].type, "error");
    assert.match(notifications[0].message, new RegExp(`Usage: /${name}`));
  }
});

test("empty arguments and trailing whitespace invoke the appropriate API", async () => {
  for (const args of ["", " \t "]) {
    for (const [name, expected] of [["clear", "newSession"], ["exit", "shutdown"]]) {
      const { commands, ctx, calls, notifications } = setup();
      await commands.get(name).handler(args, ctx);
      assert.deepEqual(calls, [expected]);
      assert.deepEqual(notifications, []);
    }
  }
});

test("clear waits for a session switch and leaves cancellation to Pi", async () => {
  let resolveSwitch;
  const switching = new Promise((resolve) => { resolveSwitch = resolve; });
  const { commands, ctx, calls, notifications } = setup(() => switching);
  let finished = false;
  const running = commands.get("clear").handler("", ctx).then(() => { finished = true; });

  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(finished, false);
  resolveSwitch({ cancelled: true });
  await running;
  assert.equal(finished, true);
  assert.deepEqual(calls, ["newSession"]);
  assert.deepEqual(notifications, []);
});
