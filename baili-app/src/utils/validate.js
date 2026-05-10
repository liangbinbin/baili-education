export const validatePhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const validateCode = (code) => {
  return /^\d{6}$/.test(code)
}

export const validateName = (name) => {
  return name && name.length >= 2 && name.length <= 20
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== ''
}

export default {
  validatePhone,
  validatePassword,
  validateCode,
  validateName,
  validateRequired
}
