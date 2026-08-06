import GuestRoute from "@/components/auth/GuestRoute";
import { LoginForm } from "@/components/auth/login-form";

export default function Page() {
  return <GuestRoute>
    <LoginForm />
  </GuestRoute>;
}