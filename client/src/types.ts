interface UserType {
  userId: string;
  name: string;
  email: string;
  isApproved: boolean;
  isAdmin: boolean;
  isDeleted: boolean;
  status: string;
}

export type { UserType };
