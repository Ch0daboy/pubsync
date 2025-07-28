'use client'

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LazyMotionWrapper from "./LazyMotion";
import {
  LayoutDashboard,
  Search,
  Wand2,
  CheckSquare,
  Settings,
  RefreshCw,
  Zap,
  LogOut
} from "lucide-react";
import { useAuth } from "./AuthProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const navigationItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      description: "Overview & Analytics"
    },
    {
      title: "Content Gaps",
      url: "/content-gaps",
      icon: Search,
      description: "Opportunities"
    },
    {
      title: "Repurpose",
      url: "/repurpose",
      icon: Wand2,
      description: "AI Content Creator"
    },
    {
      title: "Review Queue",
      url: "/review-queue",
      icon: CheckSquare,
      description: "Approve Content"
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      description: "Platforms & Config"
    }
  ];

  const isActive = (url: string) => pathname === url;

  return (
    <LazyMotionWrapper>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="clay-element glass-effect sticky top-4 mx-4 mb-6 z-50">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="clay-element bg-gradient-to-br from-purple-400 to-blue-500 p-3">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">ContentSync</h1>
                <p className="text-sm text-gray-600 font-medium">Sync Your Content Across All Platforms</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="clay-element bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">AI Active</span>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="clay-button bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 px-4 py-2 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-red-700">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex gap-6 px-4">
        {/* Sidebar Navigation */}
        <nav className="w-80 space-y-3">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className={`block clay-element p-6 transition-all duration-300 ${
                isActive(item.url) 
                  ? 'clay-active' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`clay-element p-3 ${
                  isActive(item.url)
                    ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                }`}>
                  <item.icon className={`w-5 h-5 ${
                    isActive(item.url) ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    isActive(item.url) ? 'text-purple-900' : 'text-gray-900'
                  }`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm ${
                    isActive(item.url) ? 'text-purple-700' : 'text-gray-600'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="clay-element glass-effect p-8 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
    </LazyMotionWrapper>
  );
} 