export const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token')

export const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('currentUser')
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('userId')
}
