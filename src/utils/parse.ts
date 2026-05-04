export function parseJsonFields<T>(data: Record<string, string>, validFields: {field: string, size?: number}[]): T{
  
  const keys = Object.keys(data)
  let res: boolean = false;

  for (let k of keys) {
    let field = validFields.filter(item => item.field == k)[0]
    res = k === field.field ? true : false
    if (field.size && (k in data)) {
      if (field.size < data[k].length)
        throw {type: 402, message: "Payment Required"}
    }
  }

  if (!res)
    throw {type:400, message:"Invalid Arguments"}

  return data as T

}
