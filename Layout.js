import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Search, 
  Wand2, 
  CheckSquare, 
  Settings,
  RefreshCw, // Changed to represent sync
  Zap
} from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navigationItems = [
    {
      title: "Dashboard",
      url: createPageUrl("Dashboard"),
      icon: LayoutDashboard,
      description: "Overview & Analytics"
    },
    {
      title: "Content Gaps",
      url: createPageUrl("ContentGaps"),
      icon: Search,
      description: "Opportunities"
    },
    {
      title: "Repurpose",
      url: createPageUrl("Repurpose"),
      icon: Wand2,
      description: "AI Content Creator"
    },
    {
      title: "Review Queue",
      url: createPageUrl("ReviewQueue"),
      icon: CheckSquare,
      description: "Approve Content"
    },
    {
      title: "Settings",
      url: createPageUrl("Settings"),
      icon: Settings,
      description: "Platforms & Config"
    }
  ];

  const isActive = (url) => location.pathname === url;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <style>
        {`
          .clay-element {
            border-radius: 20px;
            box-shadow: 
              8px 8px 16px rgba(163, 177, 198, 0.15),
              -8px -8px 16px rgba(255, 255, 255, 0.7),
              inset 2px 2px 4px rgba(255, 255, 255, 0.3),
              inset -2px -2px 4px rgba(163, 177, 198, 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .clay-element:hover {
            transform: translateY(-2px);
            box-shadow: 
              12px 12px 24px rgba(163, 177, 198, 0.2),
              -12px -12px 24px rgba(255, 255, 255, 0.8),
              inset 2px 2px 4px rgba(255, 255, 255, 0.4),
              inset -2px -2px 4px rgba(163, 177, 198, 0.15);
          }
          
          .clay-active {
            background: linear-gradient(135deg, #E8D5FF 0%, #D5E8FF 100%);
            box-shadow: 
              inset 4px 4px 8px rgba(163, 177, 198, 0.2),
              inset -4px -4px 8px rgba(255, 255, 255, 0.5),
              4px 4px 8px rgba(163, 177, 198, 0.1);
          }
          
          .clay-button {
            border-radius: 16px;
            box-shadow: 
              4px 4px 8px rgba(163, 177, 198, 0.15),
              -4px -4px 8px rgba(255, 255, 255, 0.7);
            transition: all 0.2s ease;
          }
          
          .clay-button:active {
            box-shadow: 
              inset 2px 2px 4px rgba(163, 177, 198, 0.2),
              inset -2px -2px 4px rgba(255, 255, 255, 0.8);
            transform: scale(0.98);
          }
          
          .glass-effect {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .gradient-text {
            background: linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #10B981 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}
      </style>

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
              to={item.url}
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
  );
}