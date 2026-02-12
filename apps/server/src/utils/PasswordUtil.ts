import bcrypt from 'bcryptjs';

export class PasswordUtil {
  /**
   * Hash plain password
   * @param password - Plain password
   * @returns Hashed password
   */
  static async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare plain password with hashed password
   * @param password - Plain password
   * @param hashedPassword - Hashed password
   * @returns True if passwords match, false otherwise
   */
  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
