import { ResetPasswordForm } from "./reset-password-form";

export const metadata = {
  title: "Set a new password — QB Elite",
};

export default function ResetPasswordPage() {
  return (
    <div className="rounded-2xl border bg-card p-8 shadow-sm">
      <h1 className="mb-2 text-2xl font-extrabold uppercase tracking-tight">
        Set a new password
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Almost done. Pick something memorable.
      </p>
      <ResetPasswordForm />
    </div>
  );
}
