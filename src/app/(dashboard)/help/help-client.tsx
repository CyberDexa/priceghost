'use client';

import { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Search,
  Package,
  Bell,
  TrendingDown,
  Settings,
  Chrome,
  Mail,
  Shield,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  // Getting Started
  {
    category: 'Getting Started',
    question: 'How do I add a product to track?',
    answer: 'You can add a product in two ways: 1) Paste the product URL directly on your dashboard using the "Add Product" button. 2) Use our browser extension to add products with one click while browsing any supported store.',
  },
  {
    category: 'Getting Started',
    question: 'Which stores are supported?',
    answer: 'PriceGhost supports major retailers including Amazon, Walmart, Best Buy, Target, and eBay. We also support most other e-commerce websites - just paste any product URL and we\'ll try to track it!',
  },
  {
    category: 'Getting Started',
    question: 'Is PriceGhost free to use?',
    answer: 'Yes! PriceGhost offers a free tier that lets you track up to 20 products with daily price checks and email alerts. Premium features may be available in the future for power users.',
  },
  // Alerts
  {
    category: 'Price Alerts',
    question: 'How do price alerts work?',
    answer: 'You can set two types of alerts: 1) Target Price - Get notified when the price drops to or below your target. 2) Percentage Drop - Get notified when the price drops by a certain percentage from the original price.',
  },
  {
    category: 'Price Alerts',
    question: 'How often are prices checked?',
    answer: 'We check prices multiple times per day (every 6 hours) to ensure you don\'t miss any deals. Price checks run automatically in the background.',
  },
  {
    category: 'Price Alerts',
    question: 'Why didn\'t I receive an alert?',
    answer: 'Check the following: 1) Make sure your alert is enabled in the Alerts page. 2) Verify your email address is correct in Settings. 3) Check your spam folder. 4) Ensure "Quiet Hours" aren\'t blocking notifications.',
  },
  // Browser Extension
  {
    category: 'Browser Extension',
    question: 'How do I install the browser extension?',
    answer: 'Download the extension from the Chrome Web Store (coming soon) or load it manually in Developer Mode. The extension works with Chrome, Edge, and other Chromium-based browsers.',
  },
  {
    category: 'Browser Extension',
    question: 'What can the extension do?',
    answer: 'The extension lets you: 1) Add products to PriceGhost with one click. 2) See current tracking status on product pages. 3) View price history without leaving the store\'s website.',
  },
  // Account & Privacy
  {
    category: 'Account & Privacy',
    question: 'How is my data protected?',
    answer: 'We take privacy seriously. Your data is encrypted in transit and at rest. We only store the product information needed to track prices and never sell your data to third parties.',
  },
  {
    category: 'Account & Privacy',
    question: 'Can I export my data?',
    answer: 'Yes! Go to Settings > Data Export to download all your tracked products, price history, and alerts in CSV or JSON format.',
  },
  {
    category: 'Account & Privacy',
    question: 'How do I delete my account?',
    answer: 'Go to Settings > Danger Zone and click "Delete Account". This will permanently delete all your data including tracked products, price history, and alerts.',
  },
  // Troubleshooting
  {
    category: 'Troubleshooting',
    question: 'Why is the price showing incorrectly?',
    answer: 'Price scraping can sometimes be affected by: 1) Dynamic pricing that changes frequently. 2) Regional price differences. 3) Temporary website changes. If you notice consistent issues, please report the product.',
  },
  {
    category: 'Troubleshooting',
    question: 'What if a product is no longer available?',
    answer: 'If a product becomes unavailable or the URL changes, we\'ll show it as "Unavailable" in your dashboard. You can choose to keep tracking it (in case it comes back) or delete it.',
  },
];

const CATEGORIES = [
  { name: 'Getting Started', icon: Package },
  { name: 'Price Alerts', icon: Bell },
  { name: 'Browser Extension', icon: Chrome },
  { name: 'Account & Privacy', icon: Shield },
  { name: 'Troubleshooting', icon: Settings },
];

export function HelpClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const filteredFAQs = FAQ_DATA.filter((faq) => {
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !activeCategory || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleQuestion = (index: number) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4">
          <HelpCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Help Center</h1>
        <p className="text-zinc-400">
          Find answers to common questions or get in touch with support
        </p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help..."
            className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.name;
          return (
            <button
              key={category.name}
              onClick={() => setActiveCategory(isActive ? null : category.name)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <Icon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* FAQ List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">
            Frequently Asked Questions
            {activeCategory && (
              <span className="text-zinc-500 font-normal"> · {activeCategory}</span>
            )}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {filteredFAQs.length} {filteredFAQs.length === 1 ? 'result' : 'results'}
          </p>
        </div>

        {filteredFAQs.length > 0 ? (
          <div className="divide-y divide-zinc-800">
            {filteredFAQs.map((faq, index) => {
              const isExpanded = expandedQuestions.has(index);
              return (
                <div key={index} className="group">
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full flex items-start gap-3 p-4 text-left hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  >
                    <span className="flex-shrink-0 mt-1">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                      )}
                    </span>
                    <div className="flex-1">
                      <p className="text-white font-medium pr-4">{faq.question}</p>
                      <span className="text-xs text-zinc-600 mt-1 inline-block">
                        {faq.category}
                      </span>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pl-11">
                      <p className="text-zinc-400 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-zinc-500">No results found for "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory(null);
              }}
              className="mt-2 text-emerald-400 hover:text-emerald-300 text-sm cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Email Support</h3>
          </div>
          <p className="text-zinc-400 mb-4">
            Can't find what you're looking for? Send us an email and we'll get back to you within 24 hours.
          </p>
          <a
            href="mailto:support@priceghost.app"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            support@priceghost.app
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <MessageCircle className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Feature Requests</h3>
          </div>
          <p className="text-zinc-400 mb-4">
            Have an idea to make PriceGhost better? We'd love to hear your suggestions!
          </p>
          <a
            href="mailto:feedback@priceghost.app"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            feedback@priceghost.app
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Guides */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Guides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard"
            className="group p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <Package className="w-8 h-8 text-emerald-400 mb-3" />
            <h4 className="font-medium text-white group-hover:text-emerald-400 transition-colors">
              Add Your First Product
            </h4>
            <p className="text-sm text-zinc-500 mt-1">
              Learn how to start tracking prices
            </p>
          </Link>

          <Link
            href="/alerts"
            className="group p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <Bell className="w-8 h-8 text-amber-400 mb-3" />
            <h4 className="font-medium text-white group-hover:text-amber-400 transition-colors">
              Set Up Price Alerts
            </h4>
            <p className="text-sm text-zinc-500 mt-1">
              Never miss a price drop again
            </p>
          </Link>

          <Link
            href="/analytics"
            className="group p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <TrendingDown className="w-8 h-8 text-green-400 mb-3" />
            <h4 className="font-medium text-white group-hover:text-green-400 transition-colors">
              Track Your Savings
            </h4>
            <p className="text-sm text-zinc-500 mt-1">
              View analytics and savings stats
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
