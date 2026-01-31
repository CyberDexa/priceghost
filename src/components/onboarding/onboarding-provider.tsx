'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X, ArrowRight, ArrowLeft, Package, Bell, TrendingDown, Sparkles } from 'lucide-react';

interface OnboardingContextType {
  showOnboarding: boolean;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}

interface OnboardingProviderProps {
  children: ReactNode;
}

const ONBOARDING_STEPS = [
  {
    icon: Sparkles,
    title: 'Welcome to PriceGhost! 👻',
    description: 'Your personal price tracker that monitors prices across Amazon, Walmart, Best Buy, Target, and more. Let\'s get you started!',
    color: 'indigo',
  },
  {
    icon: Package,
    title: 'Track Any Product',
    description: 'Simply paste a product URL from your favorite store, and we\'ll start monitoring its price. You can also use our browser extension to add products with one click!',
    color: 'blue',
  },
  {
    icon: Bell,
    title: 'Set Price Alerts',
    description: 'Set target prices or percentage drop alerts. We\'ll notify you instantly via email when prices drop to your desired level.',
    color: 'amber',
  },
  {
    icon: TrendingDown,
    title: 'Save Money!',
    description: 'View price history charts, compare products, and see your total savings. Never miss a deal again!',
    color: 'green',
  },
];

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    checkOnboardingStatus();
  }, []);

  async function checkOnboardingStatus() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    // Check localStorage for onboarding completion
    const completedKey = `priceghost_onboarding_${user.id}`;
    const completed = localStorage.getItem(completedKey);
    
    if (!completed) {
      // Check if user has any products (returning user)
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      // Only show onboarding for new users with no products
      if (count === 0) {
        setShowOnboarding(true);
      }
    }
  }

  function nextStep() {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  async function skipOnboarding() {
    await markOnboardingComplete();
    setShowOnboarding(false);
  }

  async function completeOnboarding() {
    await markOnboardingComplete();
    setShowOnboarding(false);
  }

  async function markOnboardingComplete() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const completedKey = `priceghost_onboarding_${user.id}`;
      localStorage.setItem(completedKey, 'true');
    }
  }

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <OnboardingContext.Provider
      value={{
        showOnboarding,
        currentStep,
        totalSteps: ONBOARDING_STEPS.length,
        nextStep,
        prevStep,
        skipOnboarding,
        completeOnboarding,
      }}
    >
      {children}
      {showOnboarding && <OnboardingModal />}
    </OnboardingContext.Provider>
  );
}

function OnboardingModal() {
  const { currentStep, totalSteps, nextStep, prevStep, skipOnboarding, completeOnboarding } =
    useOnboarding();
  const step = ONBOARDING_STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === totalSteps - 1;

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30' },
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  };

  const colors = colorClasses[step.color];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={skipOnboarding}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={skipOnboarding}
          className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className={`w-20 h-20 mx-auto rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-6`}>
            <Icon className={`w-10 h-10 ${colors.text}`} />
          </div>

          {/* Step indicator */}
          <div className="flex justify-center gap-2 mb-6">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-indigo-500'
                    : index < currentStep
                    ? 'w-2 bg-indigo-500/50'
                    : 'w-2 bg-zinc-700'
                }`}
              />
            ))}
          </div>

          {/* Title & Description */}
          <h2 className="text-2xl font-bold text-white mb-3">{step.title}</h2>
          <p className="text-zinc-400 leading-relaxed">{step.description}</p>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 flex items-center justify-between">
          {currentStep > 0 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <button
              onClick={skipOnboarding}
              className="px-4 py-2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Skip
            </button>
          )}

          <button
            onClick={isLastStep ? completeOnboarding : nextStep}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
          >
            {isLastStep ? "Let's Go!" : 'Next'}
            {!isLastStep && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
