const rateLimitMap = new Map<string, number>()

const MAX_WORDS_PER_REQUEST = 80000

// storing in memory the token and wordCount as {token: wordCount} to keep track for the rate limiting
export const addRequest = (token: string, wordCount: number) => {

  if (!rateLimitMap.has(token)) {
    rateLimitMap.set(token, wordCount)
    return
  }

  if (rateLimitMap.has(token)) {
    let words = <number>rateLimitMap.get(token)
    rateLimitMap.set(token, words + wordCount)
    if ((words + wordCount) > MAX_WORDS_PER_REQUEST)
      throw {type: 402, message: "Payment Required"}
  }
  
  console.log(rateLimitMap)

}
