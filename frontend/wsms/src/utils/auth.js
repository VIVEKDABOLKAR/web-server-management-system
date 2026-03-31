import api from "../services/api"


export const isAdminToken = async() => {
  try{
    const response = await api.get("/api/admin/is_admin")
    return response.data

  } catch  {
    return false  
  }
}
