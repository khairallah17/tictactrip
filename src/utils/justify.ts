export const justifyText = (text: string): string => {

  let justifiedText: string = ""
  let count = 0

  for (let i = 0 ; i < text.length ; i++) {
    justifiedText += text[i]
    count += 1
    if (count == 80) {
      justifiedText += '\n'
      count = 0;
    }
  }

  return justifiedText

}
