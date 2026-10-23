import js from '@eslint/js'
import ts from 'typescript-eslint'
export default ts.config(
  { ignores: ['.next/**','node_modules/**','Jason_Phase_2_Completion_Package_IQ400/**','next-env.d.ts','app/payment/form.tsx.bak'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  { languageOptions: { globals: { process: 'readonly', console: 'readonly', Buffer: 'readonly', window: 'readonly', document: 'readonly', localStorage: 'readonly', sessionStorage: 'readonly', crypto: 'readonly', fetch: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly', setInterval: 'readonly', URL: 'readonly', URLSearchParams: 'readonly', Request: 'readonly', Response: 'readonly', AbortSignal: 'readonly' } },
    rules: { '@typescript-eslint/no-explicit-any': 'off', '@typescript-eslint/no-unused-vars': ['warn',{ argsIgnorePattern:'^_', varsIgnorePattern:'^_' }], 'no-empty': ['error',{ allowEmptyCatch:true }], '@typescript-eslint/no-require-imports': 'off', 'no-undef': 'off' } },
  { files: ['*.js'], languageOptions: { sourceType: 'commonjs' } },
)
