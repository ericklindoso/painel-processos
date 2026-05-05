"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { Process } from "@/lib/types";

const PRESET_COLORS = [
  { name: "Sage", value: "#7B9E7E" },
  { name: "Verde", value: "#1FB678" },
  { name: "Cobre", value: "#D87C2D" },
  { name: "Âmbar", value: "#F4B03A" },
  { name: "Rubro", value: "#E44B3D" },
  { name: "Azul", value: "#3D7BE4" },
  { name: "Royal", value: "#5945D8" },
  { name: "Rosa", value: "#E04B8C" },
  { name: "Cinza", value: "#5C6478" },
  { name: "Neutro", value: "#1F2937" },
];

type Props = {
  initial?: Process;
  action: (formData: FormData) => Promise<{ ok: false; error: string } | undefined>;
  submitLabel: string;
};

export function ProcessForm({ initial, action, submitLabel }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState(initial?.cor ?? PRESET_COLORS[0].value);
  const [statusPreview, setStatusPreview] = useState(initial?.status ?? "");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("cor", color);
    startTransition(async () => {
      const res = await action(fd);
      if (res && !res.ok) setError(res.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Left: form fields */}
      <div className="space-y-6">
        <Field
          label="Número do processo"
          hint="único · obrigatório"
          required
        >
          <input
            name="numero"
            required
            defaultValue={initial?.numero}
            placeholder="ex: 2026/0001-A"
            className="field-input"
          />
        </Field>

        <Field label="Objeto" hint="descrição resumida · obrigatório" required>
          <textarea
            name="objeto"
            required
            defaultValue={initial?.objeto}
            rows={3}
            placeholder="Aquisição de equipamentos para o setor administrativo..."
            className="field-input resize-none"
          />
        </Field>

        <Field label="Status atual" hint="texto livre · será exibido em CAIXA ALTA">
          <input
            name="status"
            required
            defaultValue={initial?.status}
            onChange={(e) => setStatusPreview(e.target.value)}
            placeholder="ex: em análise"
            className="field-input"
            style={{ textTransform: "uppercase" }}
          />
        </Field>

        {error && (
          <div className="border border-[--color-rust]/40 bg-[--color-rust]/10 p-3 font-mono text-xs text-[--color-rust]">
            ⚠ {error}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[--color-panel-line] pt-6">
          <Link href="/admin" className="btn btn-ghost">
            ◀ Cancelar
          </Link>
          <button type="submit" disabled={pending} className="btn btn-primary">
            {pending ? "salvando..." : submitLabel}
          </button>
        </div>
      </div>

      {/* Right: color picker + preview */}
      <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
        <div className="border border-[--color-panel-line] bg-[--color-panel] p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[--color-amber]">
            ⟶ Cor do status
          </div>
          <p className="mt-1 font-serif text-sm italic text-[--color-ink-dim]">
            usada no telão para destacar visualmente.
          </p>

          <div className="mt-4 grid grid-cols-5 gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                title={c.name}
                className={`relative aspect-square rounded-sm transition ${
                  color === c.value
                    ? "ring-2 ring-[--color-amber] ring-offset-2 ring-offset-[--color-panel]"
                    : "hover:scale-105"
                }`}
                style={{ background: c.value }}
              />
            ))}
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-ink-dim]">
              hex personalizado
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value.toUpperCase())}
                className="h-10 w-14 cursor-pointer border border-[--color-panel-line] bg-transparent"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setColor(v.toUpperCase());
                }}
                maxLength={7}
                className="field-input"
              />
            </div>
          </label>
        </div>

        {/* Live preview */}
        <div className="border border-[--color-panel-line] p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[--color-ink-dim]">
            ⟶ Pré-visualização
          </div>
          <div className="mt-4 flex items-center gap-3 border-l-4 px-4 py-3" style={{ borderColor: color, background: "rgba(255,255,255,0.02)" }}>
            <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
            <span className="font-display text-2xl font-black uppercase tracking-wide" style={{ color }}>
              {statusPreview || "STATUS"}
            </span>
          </div>
        </div>
      </aside>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[--color-cream]">
          ⟶ {label}
          {required && <span className="ml-1 text-[--color-amber]">*</span>}
        </span>
        {hint && (
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[--color-ink-mute]">
            {hint}
          </span>
        )}
      </span>
      {children}
    </label>
  );
}
