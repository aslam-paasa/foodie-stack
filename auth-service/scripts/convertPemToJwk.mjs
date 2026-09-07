/**
 * RSA Pem to Jwk Library:
 * - Converts PEM encoded RSA public and private keys to the JWK (JSON Web Key) format.
 * - npm i rsa-pem-to-jwk
 */

import fs from 'fs';
import rsaPemToJwk from 'rsa-pem-to-jwk';

const privateKey = fs.readFileSync('./certs/private.pem');

const jwk = rsaPemToJwk(privateKey, { use: 'sig' }, 'public');

console.log(JSON.stringify(jwk));