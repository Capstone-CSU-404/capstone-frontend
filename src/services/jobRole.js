import api from "./api"

export const getJobRecommendation = async (
  payload
) => {

  const response = await api.post(
    "/job-role/recommend",
    payload
  )

  return response.data
}

export const uploadCV = async (file) => {

  const formData = new FormData()

  formData.append("file", file)

  const response = await api.post(
    "/document/upload",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  )

  console.log("response kiye su :", response.data)
  return response.data
}