"use client";

import { motion } from "framer-motion";
import { Github, FolderOpen, Edit3, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Connect GitHub",
    description: "Securely connect your GitHub account with OAuth. We only request read access to your public repositories.",
    icon: Github,
    gradient: "from-purple-500 to-purple-700",
  },
  {
    number: "02",
    title: "Select a Repo",
    description: "Choose which repository you want to track. We'll monitor your commits and prepare them for social sharing.",
    icon: FolderOpen,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    number: "03",
    title: "Edit & Post",
    description: "Review the generated post, customize it to match your voice, and share it across LinkedIn, Twitter, or Threads.",
    icon: Edit3,
    gradient: "from-green-500 to-emerald-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Get started in three simple steps
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Step Card */}
              <div className="relative h-full rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                {/* Step Number Background */}
                <div className="absolute -top-4 -right-4 text-7xl font-bold text-slate-100 lg:text-8xl">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-6 inline-flex rounded-2xl bg-indigo-50 p-4 text-indigo-600">
                  <step.icon className="h-8 w-8" />
                </div>

                {/* Title */}
                <h3 className="mb-3 text-2xl font-semibold text-slate-900">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>

              {/* Arrow between steps - hidden on mobile, shown on desktop */}
              {index < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:block">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: index * 0.3 }}
                    className="rounded-full bg-slate-100 p-2"
                  >
                    <ArrowRight className="h-6 w-6 text-slate-400" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

