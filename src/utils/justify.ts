export const justifyText = (text: string): string => {

  let justifiedText: string = ""
  let count = 0
  let buffer: string = ""

  for (let i = 0 ; i < text.length ; i++) {
    buffer += text[i]
    count += 1
    if (count == 80) {
      buffer = buffer.trim()
      buffer += '\n'
      justifiedText += buffer
      buffer = ""
      count = 0;
    }
  }

  return justifiedText

}
