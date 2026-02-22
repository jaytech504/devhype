"use client";

import { motion } from "framer-motion";
import { GitCommit, ArrowRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="hero-pattern relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Centered Text and Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center lg:mb-24"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Turn your{" "}
            <span className="text-slate-900">code into</span>{" "}
            <span className="text-slate-900">career growth.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500 sm:text-xl"
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
            <Button size="lg" className="px-8 py-6 text-lg">
              Start for free
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
            <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-2 font-mono text-sm text-slate-700">
                <div>
                  <span className="text-slate-400">git</span> commit -m
                </div>
                <div className="text-indigo-600">"Added new feature"</div>
                <div className="pt-4 text-slate-500">
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
              <ArrowRight className="h-8 w-8 text-slate-400" />
            </motion.div>
          </motion.div>

          {/* Right: Social Media Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-900"></div>
                <div>
                  <div className="h-3 w-24 rounded bg-slate-200"></div>
                  <div className="mt-1 h-2 w-16 rounded bg-slate-100"></div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-700">
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

