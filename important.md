# JWTs are not safe: 
https://redis.com/docs/json-web-tokens-jwts-are-not-safe/?utm_source=google&utm_medium=cpc&utm_term=jwt&utm_campaign=jwt&utm_content=jwt_are_not_safe&gclid=EAIaIQobChMIkKjS6eqz9wIViJFmAh15PAjbEAAYASAAEgLuG_D_BwE

# PROJECT STRUCTURE

### For verifying JWT token
middleware -> verifyToken.js

### For Authentication Middlewares
controllers -> authController.j

### Add these to improve security in JWT tokens

res.cookie("token",token, {
    httpOnly: true,
    secure: true,
    maxAge: 1000000,
    signed: true,
});

# NodeJS popup modal
[] Find Pop Modal Template from codepen
[] Implement it for Deleting a product