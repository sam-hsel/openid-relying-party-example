# Relying Party Sample

This repository is for testing a client connection to a provider.

Usage:

- Clone this repository.
- Run `npm install` inside of the directory containing `package.json`.
- Edit `server.js` by replacing the client ID, client secret, and provider URL placeholders with your `client_id`, `client_secret`, and desired provider URL.
- Run `node server.js` inside of the directory containing `server.js`.
- Navigate in a browser to `http://localhost:3000`.
- Log into the provider.
- Use the `code` and `code_verifier` at the token endpoint within five minutes.

Feel free to replace `scope` and `redirect_uris` values with those of your own choosing, especially when testing from other environments than `localhost`.
