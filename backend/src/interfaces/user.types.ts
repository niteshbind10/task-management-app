export interface UserAttributes {
  id?: string;
  fullName: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes {
  fullName: string;
  email: string;
  password?: string;
}

export interface UserLoginAttributes {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface JwtPayload {
  userId: string;
}
