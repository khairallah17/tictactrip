interface IRateLimit {
  wordCount: number
  windowStart: number
}

const rateLimitMap = new Map<string, IRateLimit>()

const MAX_WORDS_PER_REQUEST = 80000

// getting midnight Time (hour)
const getMidnight = (): number => {
  const d = new Date()
  d.setHours(0, 0, 0)
  return d.getTime()
}

// storing in memory the token and wordCount as {token: wordCount} to keep track for the rate limiting
export const addRequest = (token: string, wordCount: number) => { 

  const entry = rateLimitMap.get(token)
  const midnight = getMidnight()
  const now = Date.now()

  // cheking if the entry for the token does not exist on the map or (the current time minus the latest request time) reached the midnight for the rate limit to restart
  if (!entry || now - entry.windowStart >= midnight) {
    rateLimitMap.set(token, { wordCount, windowStart: now })
  
  } else if (entry) {
    
    // checking if the words exceed the limit for the token
    if ((entry.wordCount + wordCount) > MAX_WORDS_PER_REQUEST)
      throw {type: 402, message: "Payment Required"}
    
    // setting the map with the correct payload data to track the rate limit
    rateLimitMap.set(token, { wordCount: entry.wordCount + wordCount, windowStart: entry.windowStart })
  }

}
