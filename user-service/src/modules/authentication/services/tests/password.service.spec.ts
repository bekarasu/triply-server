import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from '../password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash a password and generate a salt', async () => {
    const password = 'TestPassword123!';
    const result = await service.hashPassword(password);

    expect(result.hash).toBeDefined();
    expect(result.salt).toBeDefined();
    expect(result.hash).not.toBe(password);
    expect(result.salt.length).toBeGreaterThan(0);
  });

  it('should verify a correct password', async () => {
    const password = 'TestPassword123!';
    const { hash } = await service.hashPassword(password);

    const isValid = await service.verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const password = 'TestPassword123!';
    const wrongPassword = 'WrongPassword123!';
    const { hash } = await service.hashPassword(password);

    const isValid = await service.verifyPassword(wrongPassword, hash);
    expect(isValid).toBe(false);
  });

  it('should hash password with existing salt', async () => {
    const password = 'TestPassword123!';
    const salt = '$2b$12$abcdefghijklmnopqrstuv'; // Example bcrypt salt

    const hash = await service.hashPasswordWithSalt(password, salt);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });
});
