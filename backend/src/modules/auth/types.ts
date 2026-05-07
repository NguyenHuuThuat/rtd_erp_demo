/** Thông tin user đang login, attach vào request sau khi pass JWT. */
export interface UserContext {
  userId: string;
  email: string;
  fullName: string;
  companyId: string;
  /** Permission đã flatten dạng "<resource>:<action>". */
  permissions: string[];
}

export interface JwtPayload {
  sub: string;
  email: string;
  fullName: string;
  companyId: string;
  permissions: string[];
}
