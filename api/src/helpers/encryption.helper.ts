import bcrypt from 'bcrypt'

const SALT_ROUNDS = 12

/**
 * Hashes a plain text password using bcrypt
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    return hashedPassword
  } catch (error) {
    throw new Error(`Password hashing failed: ${(error as Error).message}`)
  }
}

/**
 * Compares a plain text password with a hashed password
 * @param password - The plain text password to verify
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
  } catch (error) {
    throw new Error(`Password comparison failed: ${(error as Error).message}`)
  }
}

/**
 * Validates password strength
 * @param password - The password to validate
 * @returns boolean - True if password meets requirements
 */
export const validatePassword = (password: string): boolean => {
  // Password must be at least 8 characters long
  // Must contain at least one uppercase letter, one lowercase letter, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

/**
 * Generates a random password
 * @param length - The length of the password to generate (default: 12)
 * @returns string - A randomly generated password
 */
export const generateRandomPassword = (length: number = 12): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&'
  let password = ''
  
  // Ensure at least one character from each required category
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
  password += '0123456789'[Math.floor(Math.random() * 10)]
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}