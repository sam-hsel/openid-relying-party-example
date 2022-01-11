const express = require("express");
const { Issuer, generators } = require("openid-client");

const app = express();

//Replace these placeholder values with your desired client ID, secret, and provider.
const providerUrl = "about:blank";
const clientId = "client-id";
const clientSecret = "client-secret";
const redirectUri = "http://localhost:3000/cb";

codeVerifier = 'ERROR';

app.use(express.static('public'))

//Discover the OpenID Provider
Issuer.discover(providerUrl)
  .then(function (issuer) {
    console.log("Discovered issuer %s %O", issuer.issuer, issuer.metadata);

    //Get ID, secret, redirect URIs, and response type in order
    const client = new issuer.Client({
      client_id: process.env.CLIENT_ID || clientId,
      client_secret: process.env.CLIENT_SECRET || clientSecret,
      redirect_uris: [process.env.REDIRECT_URI || redirectUri],
      response_types: ["code"],
    });

    //Set up the redirect from the Relying Party (this application) to the Provider
    app.get("/openid/start", (req, res) => {

      //Generate a code_verifier, which we'll use later
      const code_verifier = generators.codeVerifier();
      const code_challenge = generators.codeChallenge(code_verifier);

      //Keep track of the code_verifier for later.
      //This is commented out for clarity when reading the logs after the final redirect.
      //console.log("code_verifier: " + code_verifier);
      codeVerifier = code_verifier;

      //Redirect the user to the Provider, asking the Provider for the scopes listed.
      res.redirect(
        client.authorizationUrl({
          scope: "openid email offline_access",
          code_challenge,
          code_challenge_method: "S256",
          prompt: "consent"
        })
      );
    });

    console.log("Relying party started");
  });

//The user will be redirected to this Relying Party endpoint
//after logging in successfully at the Provider.
//We use these codes at the back-end.
app.get("/cb", (req, res) => {
  console.log("code: " + req.query.code);
  console.log("code_verifier: " + codeVerifier);
  return res.status("200").send("Successful login. Code: " + req.query.code + ",  Code Verifier: " + codeVerifier);
});

app.listen(3000);
