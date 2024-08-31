async function FetchHelper<T>(url: string, method: string, data?: T) {
  console.log(`${import.meta.env.VITE_BACKEND_URL}/${url}`);
  try {
    console.log(data);
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error(res.statusText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function uploadImage(file: File) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "fiverr-clone");
  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dy3m3phmg/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const responseData = await res.json();
    console.log(responseData);
    const { url } = responseData;
    return url;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export { FetchHelper, uploadImage };
