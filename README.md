# HomeServe React

This Vite + React project preserves the supplied HomeServe application's existing screens, styles, and interactions while mounting its existing app through a React component. This is a safe first migration step; the legacy feature modules can then be converted incrementally into individual React components.

## Run locally

1. Install Node.js (LTS).
2. Open this folder in VS Code.
3. Open Terminal in this folder and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the Local URL printed by Vite (usually http://localhost:5173).

To create a production build, run `npm run build`.

## Notes

- Existing app data is stored in browser localStorage.
- Existing source files are kept under `public/legacy`.
- Do not delete the legacy files; they contain the current HomeServe features.
