import axios from "@/request/axios";

export const fetchUser = async () => {
  return axios.get("/api/backend/user/hello");
};
