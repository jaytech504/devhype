"use client";

import { motion } from "framer-motion";

const companies = [
  "TechCorp",
  "StartupX",
  "DevStudio",
  "CodeLabs",
  "InnovateHub",
];

export default function SocialProof() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-500"
        >
          Trusted by developers at:
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {companies.map((company, index) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-xl font-semibold text-slate-400 transition-colors hover:text-slate-900 sm:text-2xl"
            >
              {company}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

