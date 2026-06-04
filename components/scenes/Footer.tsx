"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { z } from "zod";
import { Marquee } from "@/components/motion/Marquee";

const emailSchema = z.email();

export function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setOk(false);
      setMessage("Enter a valid email address.");
      return;
    }

    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);

    setOk(true);
    setMessage("You are on the list.");
  }

  return (
    <footer className="footer-section">
      <Marquee />
      <div className="section-shell footer-grid">
        <div>
          <p className="eyebrow">Nué</p>
          <h2 className="display">Stay close to the light.</h2>
        </div>
        <form onSubmit={onSubmit} noValidate>
          <label htmlFor="newsletter-email">Newsletter</label>
          <div className="footer-input">
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              aria-describedby="newsletter-message"
            />
            <button type="submit" aria-label="Join newsletter">
              <ArrowRight size={18} />
            </button>
          </div>
          <p id="newsletter-message" className={ok ? "success" : "error"} aria-live="polite">
            {message}
          </p>
        </form>
      </div>
      <div className="section-shell credits">
        <span>Instagram</span>
        <span>Journal</span>
        <span>Designed & built by Vorca Studio</span>
      </div>
    </footer>
  );
}
