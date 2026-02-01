"use client";

import { motion } from "framer-motion";
import { GitCommit, ArrowRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Centered Text and Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-24"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Turn your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Code
            </span>{" "}
            into Career Growth.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-lg leading-8 text-slate-400 sm:text-xl max-w-2xl mx-auto"
          >
            Stop letting your hard work go unnoticed. Connect your GitHub and
            generate viral LinkedIn & Twitter posts in seconds.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-purple-500/50 transition-all hover:scale-105 hover:shadow-purple-500/70"
            >
              <span className="relative z-10">Start for Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 opacity-0 transition-opacity group-hover:opacity-100"></div>
            </Button>
          </motion.div>
        </motion.div>

        {/* Code Snippet and Social Media Card Below */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center max-w-5xl mx-auto">
          {/* Left: Code Snippet */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative"
          >
            <div className="relative rounded-lg border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-2 font-mono text-sm">
                <div className="text-purple-400">
                  <span className="text-slate-500">git</span> commit -m
                </div>
                <div className="text-cyan-400">"Added new feature"</div>
                <div className="pt-4 text-slate-400">
                  <GitCommit className="inline h-4 w-4 mr-2" />
                  <span>abc123f</span>
                </div>
              </div>
            </div>
            {/* Transformation Arrow */}
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 hidden lg:block"
            >
              <ArrowRight className="h-8 w-8 text-purple-500" />
            </motion.div>
          </motion.div>

          {/* Right: Social Media Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm shadow-lg shadow-purple-500/20">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"></div>
                <div>
                  <div className="h-3 w-24 rounded bg-slate-700"></div>
                  <div className="mt-1 h-2 w-16 rounded bg-slate-800"></div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <p>🚀 Just shipped a new feature!</p>
                <p className="text-slate-500">#coding #webdev</p>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                <Share2 className="h-4 w-4" />
                <span>1.2k likes</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

