# Upload LessGoo to GitHub

1. Extract the ZIP.
2. Create a new repository on GitHub.
3. Choose **Add file → Upload files**.
4. Upload the contents inside `lessgoo-site` (not the ZIP itself). Keep `src` and `public` as folders and include the hidden configuration files.
5. Commit the upload.

## Run locally

Install Bun, then run in the project folder:

```sh
bun install
bun run dev
```

This is the current UI demo: trip data and chat replies are sample data; bookings, Premium, SOS alerts, and offline maps are not connected to real services.

GitHub stores the source. GitHub Pages cannot host this TanStack Start project as-is.
