import request from "request"

export const getNetMsg = <RES>(params: Parameters<typeof request>[0]): Promise<{res: RES, response: request.Response}> =>  {
  return new Promise((resolve, reject) => {
    request(params, (err, response, body) => {
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

