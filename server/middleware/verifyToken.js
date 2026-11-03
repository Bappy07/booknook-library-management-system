
const { createRemoteJWKSet, jwtVerify } = require("jose");

const AUTH_URL = process.env.BETTER_AUTH_URL;

const JWKS = createRemoteJWKSet(
  new URL(`${AUTH_URL}/api/auth/jwks`)
);

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const token = authHeader.split(" ")[1];

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: AUTH_URL,
      audience: AUTH_URL,
    });

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    next();
  } catch (error) {
    console.error("TOKEN ERROR:", error.message);

    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = verifyToken;
