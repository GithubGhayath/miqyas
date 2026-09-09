import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // Shared type definitions (Locale, Service, ImageRef, ...) are exempt:
              // they carry no domain data and every component needs them for typing.
              group: [
                "@/content/*",
                "!@/content/types",
                "../content/*",
                "!../content/types",
                "../../content/*",
                "!../../content/types",
              ],
              message: "Import data from @/lib/content instead. src/content/* (except types) is the data layer.",
            },
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["src/lib/content.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
