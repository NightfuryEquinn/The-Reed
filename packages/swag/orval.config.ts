import { defineConfig } from "orval"

export default defineConfig({
  api: {
    input: `../../apps/backend/swagger-spec.json`,
    output: {
      mode: "single",
      target: "./src/api.ts",
      override: {
        mutator: {
          path: "./src/fetch.ts",
          name: "fetchInstance",
        },
        useNamedParameters: true,
        useDates: true,
        useTypeOverInterfaces: true,
      },
    },
  },
})