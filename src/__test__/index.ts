import test from "node:test"
import assert from "node:assert"

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
