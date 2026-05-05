import { IncomingHttpHeaders, ServerResponse } from "http"

import { parseJsonFields } from "../../utils/parse"
import { justifyText } from "../../utils/justify"
import { verifyToken } from "../../utils/auth"

export const justifyRoute = async (body: Record<string, string>, headers: IncomingHttpHeaders, res: ServerResponse) => {

  try {

    const authToken = headers.authorization?.split(" ")[1]

    if (!authToken)
      throw {type: 403, message: "unAuthorized"}

    const validToken = verifyToken(authToken)

    if (validToken === null)
      throw {type: 403, message: "unAuthorized"}

    const { text } = parseJsonFields<{ text: string }>(body, [{field: "text", size: 80000}])
    const justifiedText = justifyText(text)

    res.writeHead(200, {"Content-Type":"Text/plain"})
    res.write(justifiedText)

  } catch (error: any) {

    if (error.type && error.message) {
      res.writeHead(error.type, {"Content-Type":"text/plain"})
      res.write(error.message)
    } else {
      res.writeHead(500, {"Content-Type":"text/plain"})
      res.write("Internal Server Error")
    }

    console.error(error)

  } finally {
    return res.end()
  }

}
