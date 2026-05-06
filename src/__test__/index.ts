import path from "path"
import process from "process"
import test, { describe, it } from "node:test"
import assert from "node:assert"
import * as fs from "fs"

const URL = "http://localhost:3030"

async function useFetch(endpoint: string, method: "POST" | "GET", content?: Object, hds?: Object) {
  
  try {

    let requestHeaders: Headers = new Headers()

    if (hds) {
      const entries = Object.entries(hds)
      entries.forEach(item => requestHeaders.set(item[0], item[1]))
    }

    const res = await fetch(`${URL}${endpoint}`, {
      method,
      body: content ? JSON.stringify(content) : null,
      headers: requestHeaders
    })
    
    const body = await res.text()
    const status = res.status

    return {text: body, status}

  } catch (error) {
    console.error(error)
  } 

}

async function authenticate() {

  try {

    const res = await useFetch("/api/token", "POST", {
      email: "admin@email.com",
      password: "admin123"
    })

    return res?.text

  } catch (error) {
    console.error(error)
  }

}

test('start testing', () => {
  assert.strictEqual(1, 1)
})

// initial test for server health
test('Testing health endpoint', async () => {
  
  const response = await fetch("http://localhost:3030/api/health")
                          .then((res) => res.text())
                          .catch(error => console.error(error))
  assert.strictEqual(response, "API WORKING!")

})

describe("testing /api/token endpoint", () => {

  it("should return 'Incorrect email or password'", async () => {
    
    const res = await fetch(`${URL}/api/token`,{
      method: "POST",
      body: JSON.stringify({email: "", password: ""})
    }).then(async (res) => {
      const r = await res.text()
      return {text: r, status: res.status}
    }).catch(error => console.error(error))

    assert.strictEqual(res?.status, 400)
    assert.strictEqual(res?.text, "Incorrect Email or Password")

  })

  it("should return token for valid email and password", async () => {

    const res = await useFetch("/api/token", "POST", {email: "admin@email.com",password: "admin123"})
    assert.strictEqual(res?.status, 200)
  
  })

  it("should return invalid Arguments", async () => {

    const res = await useFetch("/api/token", "POST", {test: "admin@email"})
    assert.strictEqual(res?.status, 400)
    assert.strictEqual(res?.text, "Invalid Arguments")

  })

})

describe("testing /api/justify endpoint", () => {

  it("should return 'unAuthorized'", async () => {

    const res = await useFetch("/api/justify", "POST", {text: "sdfsdf"})
    assert.strictEqual(res?.status, 403)
    assert.strictEqual(res?.text, "unAuthorized")

  })

  it("should return jutifiedText", async () => {

    // authenticate the user firs
    const token = await authenticate()

    const testCase = fs.readFileSync(path.join(process.cwd(), "/src/__test__/testCases/case1/input.txt"))
    const res = await useFetch("/api/justify", "POST", {text: testCase.toString()}, {authorization: `Bearer ${token}`})
    
    const expectedText = fs.readFileSync(path.join(process.cwd(), "/src/__test__/testCases/case1/output.txt"))

    // assert.strictEqual(res?.text, expectedText.toString())
    assert.strictEqual(res?.status, 200)

  })

  it("should return 'Payment required'", async () => {
  
    
    // authenticate the user firs
    const token = await authenticate()

    const testCase = fs.readFileSync(path.join(process.cwd(), "/src/__test__/testCases/case1/input.txt"))
    let res;
  
    // sending multiple requests until we reach the rate limit
    for (let i = 0 ; i < 1000 ; i++) {
      res = await useFetch("/api/justify", "POST", {text: testCase.toString()}, {authorization: `Bearer ${token}`})
      if (res?.status == 402)
        return
    }
    assert.strictEqual(res?.status, 402)
    assert.strictEqual(res?.text, "Payment Required")

  })

})
