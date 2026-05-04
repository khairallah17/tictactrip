export function parseJsonFields<T>(data: Record<string, string>, validFields: {field: string, size?: number}[]): T{
  
  const keys = Object.keys(data)
  let res: boolean = false;

  for (let k of keys) {
    let field = validFields.filter(item => item.field)[0]
    res = k === field.field ? true : false
    if (field.size && (k in data)) {
      res = data[k].length > field.size ? false : true
    }
  }

  if (!res)
    throw new Error("Invalid Arguments")

  return data as T

}
