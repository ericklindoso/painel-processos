import type { Metadata } from "next";
import {
  Big_Shoulders,
  Instrument_Sans,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Painel de Processos · Acompanhamento Administrativo",
  description:
    "Cadastro, gestão e exibição em tempo real de processos administrativos em formato de painel rotativo estilo aeroporto.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${bigShoulders.variable} ${instrumentSans.variable} ${instrumentSerif.variable} ${jetBrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
