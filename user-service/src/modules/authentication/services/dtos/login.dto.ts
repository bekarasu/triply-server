export class OAuthCredentials {
  email?: string;
  password?: string;
}

export class LoginDto {
  provider: string;
  credentials: OAuthCredentials;
}
