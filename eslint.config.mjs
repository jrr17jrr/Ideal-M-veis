import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      /**
       * Regra nova e ainda experimental do eslint-plugin-react-hooks v6.
       * Nossos efeitos que chamam setState (hidratar carrinho/favoritos do
       * localStorage, buscar frete ao abrir a etapa) são padrões válidos de
       * sincronização com sistemas externos. Mantemos como aviso.
       */
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "scripts/**",
  ]),
]);

export default eslintConfig;
