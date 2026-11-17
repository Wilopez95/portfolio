import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/auth";
import { LoginForm } from "./LoginForm";

const safeNext = (next: string | undefined) =>
  next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin/cv";

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { next } = await searchParams;
  const target = safeNext(typeof next === "string" ? next : undefined);
  if (await isAdmin()) redirect(target);
  return <LoginForm next={target} />;
}
