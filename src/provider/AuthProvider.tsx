// providers/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn, userLoggedOut } from "@/redux/features/auth/authSlice";
import { TUser } from "@/types/user";

export default function AuthProvider({
  user,
  children,
}: {
  user: TUser | undefined;
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(userLoggedIn({ user }));
    } else {
      dispatch(userLoggedOut());
    }
  }, [user, dispatch]);

  return <>{children}</>;
}
