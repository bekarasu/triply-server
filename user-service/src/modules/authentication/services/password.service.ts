import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 12;

  /**
   * Hash a password with a salt
   * @param password - Plain text password
   * @returns Promise containing the hashed password and salt
   */
  async hashPassword(
    password: string,
  ): Promise<{ hash: string; salt: string }> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    const hash = await bcrypt.hash(password, salt);

    return {
      hash,
      salt,
    };
  }

  /**
   * Verify a password against a hash
   * @param password - Plain text password
   * @param hash - Stored password hash
   * @returns Promise<boolean> indicating if password is valid
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Hash password with existing salt (for compatibility)
   * @param password - Plain text password
   * @param salt - Existing salt
   * @returns Promise<string> containing the hashed password
   */
  async hashPasswordWithSalt(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
