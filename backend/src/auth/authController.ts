interface User {
  id: string;
  email: string;
  brandSettings: {
    tone: string;
    style: string;
    targetPlatforms: string[];
  };
  socialAccounts: SocialAccount[];
}

class AuthController {
  async register(userData: UserRegistrationDTO): Promise<User> {
    // Implementation
  }
  
  async login(credentials: LoginDTO): Promise<AuthToken> {
    // Implementation
  }
} 