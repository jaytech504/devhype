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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              grow your presence
            </span>
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
              className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-sm transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div
                className={`mb-6 inline-flex rounded-lg bg-gradient-to-r ${feature.gradient} p-3`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>

              {/* Multi-platform icons */}
              {feature.subIcons && (
                <div className="mt-6 flex items-center gap-3">
                  {feature.subIcons.map((Icon, iconIndex) => (
                    <div
                      key={iconIndex}
                      className="rounded-lg border border-slate-700 bg-slate-800/50 p-2 transition-colors hover:border-cyan-500/50"
                    >
                      <Icon className="h-5 w-5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Hover glow effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-cyan-500/0 opacity-0 transition-opacity group-hover:opacity-100"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

