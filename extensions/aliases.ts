import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerCommand("clear", {
    description: "Start a new session (alias for /new)",
    handler: async (args, ctx) => {
      if (args.trim()) {
        ctx.ui.notify("/clear does not accept arguments. Usage: /clear", "error");
        return;
      }

      await ctx.newSession();
    },
  });

  pi.registerCommand("exit", {
    description: "Exit Pi when idle (alias for /quit)",
    handler: async (args, ctx) => {
      if (args.trim()) {
        ctx.ui.notify("/exit does not accept arguments. Usage: /exit", "error");
        return;
      }

      ctx.shutdown();
    },
  });
}
