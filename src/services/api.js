import Axios from "axios"

export const BASE_URL = "https://the-book-fair.onrender.com"

const User = Axios.create({ baseURL: BASE_URL })

User.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers["authorization"] = `Bearer ${token}`
    }
    return config
  },
  async (error) => {
    console.log({ msg: "Axios Interceptor Error!", error })
    throw error
  }
)

export default User
