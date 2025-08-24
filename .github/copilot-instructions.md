LLM Notes:

Validation Guidelines:

- If you try to validate changes made to the sveltekit app and run `npm run dev` or `npm run preview` the terminal will hang because that's a held process. Don't run those commands, I already have the app running on 5173

Technical Guidelines:

- Do not run terminal commands without asking for approval
- Base asthetic related css on existing components and pages, and the reusable tailwind collections defined in src/lib/ccsUtils.ts.
- TypeScript Support: Full type safety with proper API declarations
- Svelte 4: Use Svelte 4 syntax, runs like `$state` from Svelte 5 ARE NOT ALLOWED
- Responsive Design: Better styling that works on different screen sizes. You're free to use tailwind.
- Browser Compatibility: Clear messaging in chat responses about browser support requirements. Not displayed on the UI.
- Component Architecture: Reusable component that can be easily imported elsewhere. Feel free to create additional components and ensure the Page.svelte files stay reasonably small.
