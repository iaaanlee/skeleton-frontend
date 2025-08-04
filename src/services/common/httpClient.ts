import { AxiosHttpClient } from "./axiosHttpClient"
import { BACKEND_URL } from "./config";

export const backendHttpClient = new AxiosHttpClient(BACKEND_URL);