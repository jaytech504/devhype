"use client";

import { motion } from "framer-motion";
import { GitCommit, Linkedin, Twitter, MessageSquare, Shield } from "lucide-react";

const features = [
  {
    title: "Automated Changelogs",
    description:
      "Transform your commit messages into engaging content automatically. No manual writing required.",
    icon: GitCommit,
    gradient: "from-purple-500 to-purple-700",
  },
  {
    title: "Multi-Platform Ready",
    description:
      "Generate posts optimized for LinkedIn, Twitter, and Threads. One commit, multiple platforms.",
    icon: Linkedin,
    gradient: "from-cyan-500 to-blue-600",
    subIcons: [Linkedin, Twitter, MessageSquare],
  },
  {
    title: "Privacy First",
    description:
      "We don't read your private code, only commit messages. Your code stays yours, always.",
    icon: Shield,
    gradient: "from-green-500 to-emerald-600",
  },
];

export default function FeatureGrid() {
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
            Everything you need to grow your presence
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md"
            >
              <div
                className="mb-6 inline-flex rounded-lg bg-indigo-50 p-3 text-indigo-600"
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600">{feature.description}</p>

              {/* Multi-platform icons */}
              {feature.subIcons && (
                <div className="mt-6 flex items-center gap-3">
                  {feature.subIcons.map((Icon, iconIndex) => (
                    <div
                      key={iconIndex}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-2 transition-colors hover:border-indigo-200"
                    >
                      <Icon className="h-5 w-5 text-slate-500" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

