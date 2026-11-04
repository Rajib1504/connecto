import type { Response } from "express"

export interface ApiResponseBody<T> {
      success: true
      message: string
      data: T | null
}

class ApiResponse {
      static ok<T>(
            res: Response<ApiResponseBody<T>>,
            message: string,
            data: T | null = null,
      ) {
            return res.status(200).json({
                  success: true,
                  message,
                  data,
            })
      }

      static created<T>(
            res: Response<ApiResponseBody<T>>,
            message: string,
            data: T | null = null,
      ) {
            return res.status(201).json({
                  success: true,
                  message,
                  data,
            })
      }
}

export default ApiResponse
