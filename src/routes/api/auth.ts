import { ServerResponse } from "http"
import { parseJsonFields } from "../../utils/parse"
import { generateToken } from "../../utils/auth"

export const authRoute = (body: Record<string, string>, res: ServerResponse) => {
  
  try {

    const { email, password } = parseJsonFields<{ email: string, password: string }>(body, [{field: "email"},{field: "password"}])

    if (email !== "admin@email.com" || password !== "admin123")
      throw {type: 400, message: "Incorrect Email or Password"}

    const token = generateToken({email})

    res.writeHead(200, {"Content-Type":"text/plain"})
    res.write(token)

  } catch (error: any) {
    if (error.type && error.message) {
      res.writeHead(error.type, {"Content-Type":"text/plain"})
      res.write(error.message)
    }
    console.error(error)
  } finally {
    return res.end()
  }

}
