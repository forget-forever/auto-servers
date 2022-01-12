import request from "request"
import { httpBuilderUrl } from ".";

export const getNetMsg = <RES>(params: Parameters<typeof request>[0]): Promise<{res: RES, response: request.Response}> =>  {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const {url = '', formData, method = 'get'} = params || {}
  const requestUrl = method.toLocaleLowerCase() === 'get' ? httpBuilderUrl(url, formData as Record<string, string>) : url
  return new Promise((resolve, reject) => {
    request({
      ...params,
      url: requestUrl,
    }, (err, response, body) => {
      if (!err && +response.statusCode === 200) {
        try {
          const res = JSON.parse(body)
          resolve({res, response})
        } catch (error) {
          resolve({res: body, response})
        }
      } else {
        reject({err, response, body})
      }
    })
  })
};

