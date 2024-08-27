async function FetchHelper<T>(url: string, method: string, data?: T) {
  console.log(`${import.meta.env.VITE_BACKEND_URL}/${url}`);
  try {
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

export default FetchHelper;
