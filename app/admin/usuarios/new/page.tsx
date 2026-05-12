import Link from "next/link";
import { UserForm } from "../user-form";

export default function NewUsuarioPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:px-12">
      <div className="mb-10">
        <Link
          href="/admin/usuarios"
          className="label-eyebrow hover:text-[--color-claret]"
        >
          ← Voltar
        </Link>
        <p className="mt-6 label-eyebrow text-[--color-claret]">
          Controle de acesso
        </p>
        <h1 className="headline mt-2 text-5xl text-[--color-ink]">
          Novo usuário.
        </h1>
        <p className="mt-3 font-serif text-lg italic text-[--color-ink-dim]">
          Defina o nome de usuário, e-mail e senha de acesso.
        </p>
      </div>

      <UserForm />
    </div>
  );
}
