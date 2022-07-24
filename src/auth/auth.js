const { response } = require("../app");
const tokenEndpoint = new URL(`${process.env.AUTH_ISSUER}oauth/token`);

const auth = async (req, res, next) => {
  console.log({ authorisation: "this is from auth to make sure it's working" });
  req.user = { _id: 1513205486516, nickname: "user101" };
  //query db for user ( and auth0 api)
  var code = req.query.code;
  if (!code) res.status(403).send("authorization required");
  tokenEndpoint.searchParams.append("grant_type", "authorization_code");
  tokenEndpoint.searchParams.append("client_id", process.env.AUTH_CLIENT_ID);
  tokenEndpoint.searchParams.append(
    "client_secret",
    process.env.AUTH_CLIENT_SECRET
  );
  tokenEndpoint.searchParams.append("code", code);

  // idk we'll see after lunch
  fetch(tokenEndpoint, {
    method: "POST",
    mode: "cors",
  })
    .then((response) => {
      console.log(response);
      next();
    })
    .catch((e) => res.status(403).send({ error: e.message }));
};

module.exports = { auth };
