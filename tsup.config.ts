import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  noExternal: ["@dl-io/shared"],
  clean: true,
});
