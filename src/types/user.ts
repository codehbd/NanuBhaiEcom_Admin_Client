export type TUser = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  status: "active" | "inactive" | string; // You can refine this enum
  role: "admin" | "user" | string; // Refine based on roles in your system
  provider: "credentials" | "google" | string;
  isVerified: boolean;
  createdAt: Date; // or Date if parsed
  updatedAt: Date; // or Date if parsed
};
