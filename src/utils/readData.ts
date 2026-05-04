import { IncomingMessage } from "http" 

export async function readBody(req: IncomingMessage): Promise<Record<string, string>> {
  return new Promise<Record<string, string>>((resolve, reject) => {
    
    let strBody: string = ""
    let jsonBody: Object = {}
    
    // reading body data from the readable stream
    req.on("readable", () => {
      console.log("READING STREAM STARTED")
      strBody += req.read()
    })

    // handling the return value for the json body
    req.on("end", () => {
      console.log("END OF STREAM")
      strBody = strBody.split("null").join("")
      jsonBody = JSON.parse(strBody)
      resolve(jsonBody as Record<string, string>)
    })

    // error handling
    req.on("error", () => {
      console.log("STREAM ERROR")
      reject()
    })

  })
}
