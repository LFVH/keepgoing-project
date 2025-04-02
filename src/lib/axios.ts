// import { s } from "next-auth/react"
import axios from "axios"
import { getSession } from "next-auth/react"
const api = axios.create({

  // baseURL: "https://srv.sindiedutec.org.br",
  // baseURL: "https://sindiedutec-server.vercel.app"
   baseURL: "http://localhost:3000/api",

})
api.interceptors.request.use(
  async (config) => {
    const session: any = await getSession()
    const token = session?.token || ""
    config.headers["Authorization"] = "Bearer " + token
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)
export default api
