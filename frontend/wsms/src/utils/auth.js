import api from "../services/api"


export const isAdminToken = async() => {
  try{
    const response = await api.get("/api/users/is_admin")
    return response.data

  } catch (err)  {
    console.log(err);
    return false  
  }
}
