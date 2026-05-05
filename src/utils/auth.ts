import { createHmac, timingSafeEqual } from "crypto"

const SECRET = "secret"

if (!SECRET)
  throw {error: 500, message: "empty secret"}

// generating base64url data
const base64url = (obj: Object): string => {
  return Buffer.from(JSON.stringify(obj)).toString('base64url')
}

export const generateToken = (payload: Object): string => {

  // creating token from payload using SHA256 algorithm and hashing with provided secret
  const header = base64url({alg: 'HS256', type: 'JWT'})
  const body = base64url(payload)
  const sig = createHmac('sha256', SECRET)
                .update(`${header}.${body}`)
                .digest('base64url')

  return `${header}.${body}.${sig}`;
}

export const verifyToken = (token: string): Object | null => {

  // getting the token data
  const [header, body, sig] = token.split(".")
  console.log({header, body, sig})
  const expectedSig = createHmac('sha256', SECRET)
                        .update(`${header}.${body}`)
                        .digest('base64url')

  // comparing the signature from the user token with the signature generate using the SECRET
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig)))
    return null

  // converting the body from base64url to valid json object
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
  
  // checking if the token is expired
  if (payload.exp && Date.now() / 1000 > payload.exp)
    return null
  return payload
}
