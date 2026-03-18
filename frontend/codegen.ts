import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: process.env.VITE_SERVER_URL || "http://localhost:8000/graphql",
  documents: ["./src/graphql/*.ts"],
  generates: {
    "./src/graphql/generated/types.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
  },
};

export default config;
