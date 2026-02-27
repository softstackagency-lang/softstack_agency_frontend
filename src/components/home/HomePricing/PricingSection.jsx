"use client";

import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import OrderModal from "@/components/order/OrderModal";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api'}/pricing`;

export default function PricingSection() {
  const router = useRouter();
  const { user, loading: authLoading } = useCustomAuth();
  const [currency, setCurrency] = useState("USD");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Order Modal State
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(API_BASE_URL, { cache: 'no-store' });
      
      if (!response.ok) {
        throw new Error('Failed to fetch pricing data');
      }
      
      const data = await response.json();
      
      if (data.success && data.data.categories) {
        const activeCategories = data.data.categories.filter(cat => cat.isActive);
        setCategories(activeCategories);
        
        // Set first category as default
        if (activeCategories.length > 0) {
          setSelectedCategory(activeCategories[0]._id);
          
          // Get ALL plans for the first category (not filtering by isActive yet since the first category might not have that field)
          const firstCategoryPlans = activeCategories[0].plans || [];
          // Filter out inactive plans if isActive field exists
          const activePlans = firstCategoryPlans.filter(plan => plan.isActive !== false);
          setPlans(activePlans);
          
        }
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    const category = categories.find(cat => cat._id === categoryId);
    if (category) {
      // Get all plans, filter out inactive ones (isActive: false)
      const categoryPlans = category.plans || [];
      const activePlans = categoryPlans.filter(plan => plan.isActive !== false);
      setPlans(activePlans);
    }
  };

  const handleOrderClick = (plan) => {
    // Check if user is logged in
    if (!user && !authLoading) {
      toast.warning("Please sign up to get started with our pricing plans!", {
        position: "top-center",
        autoClose: 3000,
      });
      router.push('/signup');
      return;
    }
    
    setSelectedPlan(plan);
    setOrderModalOpen(true);
  };

  return (
    <section className="relative min-h-screen bg-[#070b14] text-white overflow-hidden">

      {/* ================= STRONG SQUARE GRID BACKGROUND ================= */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
        }}
      />

      {/* ================= SOFT GLOW FILTERS ================= */}
      <div className="pointer-events-none absolute inset-0 z-1">
        <div className="absolute -left-48 top-1/4 w-130 h-130 bg-cyan-500/25 rounded-full blur-[160px] mix-blend-screen animate-float-slow" />
        <div className="absolute -right-48 top-1/3 w-130 h-130 bg-purple-500/25 rounded-full blur-[160px] mix-blend-screen animate-float-slower" />
        <div className="absolute -bottom-64 left-1/2 -translate-x-1/2 w-180 h-105 bg-blue-500/25 rounded-full blur-[180px] mix-blend-screen animate-float-reverse" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">

        {/* ===== HEADER ===== */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Simple <span className="text-cyan-400">Pricing</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Flexible plans for startups, growing teams, and enterprises. Choose a billing cycle and currency that works best for you.
          </p>

          {/* ===== Currency Toggle ===== */}
          <div className="flex justify-center mt-8">
            <div className="flex bg-white/5 backdrop-blur-md rounded-full p-1 border border-white/10">
              {["USD", "BDT"].map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition
                    ${currency === c ? "bg-cyan-500 text-black" : "text-gray-300 hover:text-white"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* ===== Category/Billing Toggle ===== */}
          {!loading && categories.length > 0 && (
            <div className="flex justify-center mt-6">
              <div className="flex flex-wrap justify-center gap-2 bg-white/5 rounded-full p-1 border border-white/10 max-w-4xl">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryChange(category._id)}
                    className={`px-6 py-2 rounded-full text-sm transition
                      ${selectedCategory === category._id ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== LOADING STATE ===== */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <span className="ml-3 text-gray-400">Loading pricing plans...</span>
          </div>
        )}

        {/* ===== ERROR STATE ===== */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-400">Failed to load pricing: {error}</p>
            <button 
              onClick={fetchPricingData}
              className="mt-4 px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg text-cyan-400 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* ===== PRICING CARDS ===== */}
        {!loading && !error && plans.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              // Handle both billingCycle and duration fields
              const cycle = plan.billingCycle || plan.duration || 'month';
              const subtitle = plan.description || `per ${cycle}`;
              const isHighlighted = plan.recommended || plan.popular;
              
              return (
                <PricingCard
                  key={plan.id || plan._id || index}
                  title={plan.name}
                  color={index === 0 ? "text-pink-400" : index === 1 ? "text-orange-400" : "text-blue-400"}
                  price={plan.price?.[currency] ? `${currency === "USD" ? "$" : "৳"}${plan.price[currency].toLocaleString()}` : "Custom"}
                  subtitle={subtitle}
                  highlight={isHighlighted}
                  features={plan.features || []}
                  cta={plan.cta}
                  currency={currency}
                  onOrderClick={() => handleOrderClick(plan)}
                />
              );
            })}
          </div>
        )}

        {/* ===== NO PLANS STATE ===== */}
        {!loading && !error && plans.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">No pricing plans available for this category.</p>
          </div>
        )}
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        plan={selectedPlan}
        currency={currency}
      />
    </section>
  );
}

/* ================= PRICING CARD COMPONENT ================= */
function PricingCard({ title, subtitle, price, features, color, highlight, cta, onOrderClick, currency }) {
  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-linear-to-b from-white/5 to-white/0 p-8 backdrop-blur-md shadow-xl
        ${highlight ? "ring-2 ring-cyan-400/50 shadow-cyan-400/20" : ""}`}
    >
      {highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-cyan-500 to-blue-500 px-4 py-1 rounded-full text-xs font-semibold">
          {currency === "BDT" ? "জনপ্রিয়" : "Popular"}
        </div>
      )}
      
      <h3 className={`text-2xl font-bold ${color}`}>{title}</h3>
      <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>

      <div className="mt-6">
        <span className="text-4xl font-extrabold">{price}</span>
      </div>

      <ul className="mt-8 space-y-3">
        {features.map((item, i) => (
          <li key={i} className="flex gap-3 text-gray-300">
            <Check className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={onOrderClick}
        className="mt-8 w-full rounded-xl bg-white/10 hover:bg-white/20 transition py-3 font-medium"
      >
        {cta?.text || 'Order Now'}
      </button>
    </div>
  );
}
