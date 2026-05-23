import { ResetPasswordForm } from "./reset-password-form";

export const metadata = {
  title: "Set a new password — QB Elite",
};

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="text-center text-[20px] font-bold tracking-tight">
        Set a New Password
      </h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">
        Almost done. Pick something memorable.
      </p>
      <div className="mt-5">
        <ResetPasswordForm />
      </div>
    </>
  );
}
