// Using ESM:
import { expressjwt as jwt } from 'express-jwt';

// Using CommonJS:
// const jwt = require('express-jwt').expressjwt;

export const requireSignIn = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
});
