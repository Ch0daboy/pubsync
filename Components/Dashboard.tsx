'use client'

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles, TrendingUp, Search } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";
import type { Platform } from "@/types/database";

export default function Dashboard() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadPlatforms();
    }
  }, [user]);

  const loadPlatforms = async () => {
    try {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlatforms(data || []);
    } catch (error) {
      console.error('Error loading platforms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    totalPlatforms: platforms.length,
    connectedPlatforms: platforms.filter(p => p.status === 'connected').length,
    totalContent: platforms.reduce((sum, p) => sum + p.content_count, 0),
    totalGaps: platforms.reduce((sum, p) => sum + p.gap_count, 0)
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold gradient-text mb-2"
          >
            ContentSync Dashboard
          </motion.h1>
          <p className="text-gray-600 font-medium">
            Monitor your platforms and sync content across all channels seamlessly
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/content-gaps">
            <button className="clay-button bg-gradient-to-r from-orange-100 to-red-100 hover:from-orange-200 hover:to-red-200 px-6 py-3 font-semibold text-orange-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              View Gaps
            </button>
          </Link>
          <Link href="/settings">
            <button className="clay-button bg-gradient-to-r from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600 px-6 py-3 font-semibold text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Platform
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="clay-element bg-gradient-to-br from-purple-50 to-blue-50 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="clay-element bg-gradient-to-br from-purple-400 to-blue-500 p-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Platforms</h3>
          </div>
          <p className="text-3xl font-bold text-purple-900">{stats.totalPlatforms}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="clay-element bg-gradient-to-br from-green-50 to-emerald-50 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="clay-element bg-gradient-to-br from-green-400 to-emerald-500 p-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Connected</h3>
          </div>
          <p className="text-3xl font-bold text-green-900">{stats.connectedPlatforms}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="clay-element bg-gradient-to-br from-orange-50 to-red-50 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="clay-element bg-gradient-to-br from-orange-400 to-red-500 p-3">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Total Content</h3>
          </div>
          <p className="text-3xl font-bold text-orange-900">{stats.totalContent}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="clay-element bg-gradient-to-br from-blue-50 to-indigo-50 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="clay-element bg-gradient-to-br from-blue-400 to-indigo-500 p-3">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Content Gaps</h3>
          </div>
          <p className="text-3xl font-bold text-blue-900">{stats.totalGaps}</p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Platform Gallery */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="clay-element bg-gradient-to-br from-blue-400 to-indigo-500 p-2">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Connected Platforms</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="clay-element bg-white/40 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : platforms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platforms.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="clay-element bg-gradient-to-br from-gray-50 to-white p-12 text-center"
            >
              <div className="clay-element bg-gradient-to-br from-gray-200 to-gray-300 p-4 w-16 h-16 rounded-full mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Platforms Connected
              </h3>
              <p className="text-gray-600 mb-6">
                Connect your social media accounts and websites to start syncing content
              </p>
              <Link href="/settings">
                <button className="clay-button bg-gradient-to-r from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600 px-6 py-3 font-semibold text-white">
                  Connect Your First Platform
                </button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Recent Activity Sidebar */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

function PlatformCard({ platform }: { platform: Platform }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-emerald-600';
      case 'error': return 'text-red-600';
      case 'syncing': return 'text-blue-600';
      default: return 'text-amber-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'error': return 'Error';
      case 'syncing': return 'Syncing...';
      default: return 'Pending';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="clay-element cursor-pointer bg-white/60 hover:bg-white/80 p-6 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="clay-element bg-gradient-to-br from-gray-100 to-gray-200 p-3">
            <Sparkles className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 truncate max-w-32">
              {platform.name}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {platform.platform_type}
            </p>
          </div>
        </div>
        
        <div className={`text-sm font-medium ${getStatusColor(platform.status)}`}>
          {getStatusText(platform.status)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="clay-element bg-gradient-to-br from-purple-50 to-blue-50 p-3 text-center">
          <p className="text-xs font-medium text-purple-700 mb-1">Content</p>
          <p className="text-lg font-bold text-purple-900">
            {platform.content_count || 0}
          </p>
        </div>
        
        <div className="clay-element bg-gradient-to-br from-orange-50 to-red-50 p-3 text-center">
          <p className="text-xs font-medium text-orange-700 mb-1">Gaps</p>
          <p className="text-lg font-bold text-orange-900">
            {platform.gap_count || 0}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function RecentActivity() {
  return (
    <div className="clay-element bg-white/60 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div>
            <p className="text-sm font-medium text-gray-900">New platform connected</p>
            <p className="text-xs text-gray-600">YouTube channel added</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div>
            <p className="text-sm font-medium text-gray-900">Content repurposed</p>
            <p className="text-xs text-gray-600">Blog post → Twitter thread</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <div>
            <p className="text-sm font-medium text-gray-900">Content gap detected</p>
            <p className="text-xs text-gray-600">Instagram missing video content</p>
          </div>
        </div>
      </div>
    </div>
  );
} 