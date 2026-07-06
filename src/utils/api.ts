export async function apiFetch(
  url: string,
  options: RequestInit = {},
  onTokenRefreshed?: (newToken: string, newUser: any) => void,
  onLogout?: () => void
): Promise<Response> {
  const token = localStorage.getItem('token')
  const headers = {
    ...options.headers,
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  }

  let res = await fetch(url, { ...options, headers })

  if (res.status === 401) {
    // Attempt silent refresh
    try {
      const localRefreshToken = localStorage.getItem('refreshToken')
      const refreshRes = await fetch("http://localhost:3001/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: localRefreshToken }),
      })

      if (refreshRes.ok) {
        const data = await refreshRes.json()
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('user', JSON.stringify(data.user))
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken)
        }
        
        if (onTokenRefreshed) {
          onTokenRefreshed(data.accessToken, data.user)
        }

        // Retry the original request
        const retryHeaders = {
          ...options.headers,
          "Authorization": `Bearer ${data.accessToken}`,
        }
        res = await fetch(url, { ...options, headers: retryHeaders })
      } else {
        // Refresh failed (cookie expired, missing, or invalid), logout
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('refreshToken')
        if (onLogout) {
          onLogout()
        }
      }
    } catch (err) {
      console.error("Token refresh during fetch failed:", err)
      // Do not log out on network errors
    }
  }

  return res
}
