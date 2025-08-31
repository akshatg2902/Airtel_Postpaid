import React, { useMemo, useState } from "react";
import {
  Gamepad2,
  Plane,
  Brain,
  Linkedin,
  Cloud,
  HeartPulse,
  GraduationCap,
  Tv,
  Check,
} from "lucide-react";

// --- Small UI helpers -------------------------------------------------------
const Rupee = (n) => new Intl.NumberFormat("en-IN").format(n);

function Toggle({ checked, onChange, size = "md" }) {
  const sizes = {
    sm: { w: "w-10", h: "h-5", dot: "h-4 w-4", translate: "translate-x-5" },
    md: { w: "w-12", h: "h-6", dot: "h-5 w-5", translate: "translate-x-6" },
  }[size];
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`${sizes.w} ${sizes.h} inline-flex items-center rounded-full transition-colors duration-200 ${
        checked ? "bg-red-500" : "bg-gray-300"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`${sizes.dot} inline-block transform rounded-full bg-white shadow transition ${
          checked ? sizes.translate : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-2xl font-extrabold tracking-tight text-gray-900">
      {children}
    </h3>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardRow({ left, right }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">{left}</div>
      <div>{right}</div>
    </div>
  );
}

function Range({ value, min, max, step = 1, onChange }) {
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-red-500"
    />
  );
}

function Select({ value, onChange, options, disabled }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full rounded-xl border px-4 py-3 text-gray-800 ${
        disabled ? "bg-gray-100" : "bg-white"
      } border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-300`}
    >
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label} · ₹{Rupee(opt.price)}
        </option>
      ))}
    </select>
  );
}

function Chip({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-red-500 text-white border-red-500"
          : "bg-white text-gray-900 border-gray-200 hover:border-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

// --- Main Component ---------------------------------------------------------
export default function FlexiPostpaidBuilder() {
  // Base rental plans (collapsed chips + expandable details)
  const basePlans = [
    {
      price: 199,
      name: "Basic",
      benefits: ["Unlimited Calls", "100 SMS/day", "30 GB 5G data"],
    },
    {
      price: 299,
      name: "Smart",
      benefits: [
        "Unlimited Calls",
        "200 SMS/day",
        "60 GB 5G data",
        "Weekend Data Rollover",
      ],
    },
    {
      price: 399,
      name: "Max",
      benefits: [
        "Unlimited Calls",
        "300 SMS/day",
        "90 GB 5G data",
        "Weekend Data Rollover",
        "Roaming (Domestic)",
        "5G Priority Network",
      ],
    },
  ];
  const [base, setBase] = useState(basePlans[1].price);
  const [showBaseDetails, setShowBaseDetails] = useState(false);

  // Data add-on
  const [extraData, setExtraData] = useState(50); // GB
  const EXTRA_DATA_RATE = 2; // ₹2 per GB
  const extraDataPrice = useMemo(() => extraData * EXTRA_DATA_RATE, [extraData]);

  // Spend cap (visual only)
  const [cap, setCap] = useState(1000);

  // Bundles toggle state
  const [bundles, setBundles] = useState({
    gaming: true,
    travel: false,
    ai: false,
    linkedin: false,
    cloud: true,
    fitness: true,
    edu: false,
  });

  // Bundle option menus (dropdowns)
  const bundleOptions = {
    gaming: [
      { id: "xbox", label: "Xbox Live (Core)", price: 99 },
      { id: "psplus_ess", label: "PlayStation Plus Essential", price: 149 },
      { id: "psplus_extra", label: "PlayStation Plus Extra", price: 199 },
    ],
    travel: [
      { id: "domestic5", label: "Domestic 5GB", price: 199 },
      { id: "intl1", label: "International 1GB", price: 399 },
      { id: "intl3", label: "International 3GB", price: 699 },
    ],
    ai: [
      { id: "chatgpt_go", label: "ChatGPT Go", price: 99 },
      { id: "perplexity_pro", label: "Perplexity Pro", price: 299 },
      { id: "chatgpt_plus", label: "ChatGPT Plus", price: 499 },
    ],
    linkedin: [
      { id: "career", label: "LinkedIn Premium Career", price: 199 },
      { id: "business", label: "LinkedIn Premium Business", price: 349 },
    ],
    cloud: [
      { id: "100", label: "Cloud Storage 100 GB", price: 99 },
      { id: "1tb", label: "Cloud Storage 1 TB", price: 149 },
      { id: "2tb", label: "Cloud Storage 2 TB", price: 249 },
    ],
    fitness: [
      { id: "basic", label: "Fitness & Health Basic", price: 99 },
      { id: "plus", label: "Fitness & Health Plus", price: 149 },
    ],
    edu: [
      { id: "k12", label: "Education Pack K-12", price: 149 },
      { id: "college", label: "Education Pack College", price: 249 },
      { id: "pro", label: "Education Pack Pro", price: 299 },
    ],
  };

  // Selected option for each bundle
  const [selected, setSelected] = useState({
    gaming: "xbox",
    travel: "domestic5",
    ai: "chatgpt_go",
    linkedin: "career",
    cloud: "1tb",
    fitness: "basic",
    edu: "college",
  });

  // OTT pack with dropdown and different prices
  const ottOptions = [
    { id: "netflix", label: "Netflix", price: 199 },
    { id: "prime", label: "Amazon Prime", price: 149 },
    { id: "hotstar", label: "Disney+ Hotstar", price: 199 },
    { id: "sonyliv", label: "Sony LIV", price: 129 },
  ];
  const [ottOn, setOttOn] = useState(true);
  const [ottSelected, setOttSelected] = useState("netflix");

  const ottPrice = useMemo(
    () => ottOptions.find((o) => o.id === ottSelected)?.price ?? 0,
    [ottSelected]
  );

  // Derived total
  const total = useMemo(() => {
    let t = base;
    // extra data cost at ₹2/GB
    t += extraDataPrice;
    if (ottOn) t += ottPrice;
    for (const [key, on] of Object.entries(bundles)) {
      if (on) {
        const optId = selected[key];
        const price = bundleOptions[key].find((o) => o.id === optId)?.price ?? 0;
        t += price;
      }
    }
    return t;
  }, [base, extraDataPrice, ottOn, ottPrice, bundles, selected]);

  const selectedPlan = basePlans.find((p) => p.price === base);

  return (
    <div className="min-h-screen w-full bg-neutral-50 py-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="mb-4" />

        <h1 className="text-center text-3xl font-extrabold leading-tight text-red-600">
          Build Your
          <br />
          <span className="text-gray-900">Flexi-Postpaid Plan</span>
        </h1>

        {/* Base Rental: chips in one line, details expand on click */}
        <div className="mt-6 space-y-3">
          <SectionTitle>Choose Base Rental</SectionTitle>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {basePlans.map((plan) => (
              <Chip
                key={plan.price}
                active={base === plan.price}
                onClick={() => {
                  setBase(plan.price);
                  setShowBaseDetails(true);
                }}
              >
                {plan.name} · ₹{Rupee(plan.price)}
              </Chip>
            ))}
          </div>

          {showBaseDetails && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-extrabold text-gray-900">{selectedPlan.name}</div>
                  <div className="text-sm text-gray-600">Included in this plan</div>
                </div>
                <button
                  onClick={() => setShowBaseDetails(false)}
                  className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-800"
                >
                  Collapse
                </button>
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {selectedPlan.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-gray-800">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <Check className="h-4 w-4" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Add Extra Data */}
        <div className="mt-7">
          <SectionTitle>Add Extra Data</SectionTitle>
          <div className="text-sm text-gray-500">₹2/GB</div>
          <div className="mt-3">
            <Range value={extraData} min={0} max={100} step={1} onChange={setExtraData} />
            <div className="mt-1 flex items-center justify-between text-lg font-semibold text-gray-700">
              <span>{extraData} GB</span>
              <span>+₹{Rupee(extraDataPrice)}</span>
            </div>
          </div>
        </div>

        {/* Choose Bundles */}
        <div className="mt-8 space-y-4">
          <SectionTitle>Choose Bundles</SectionTitle>

          {/* Grid with OTT included as same-sized card */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* OTT card (same size) */}
            <Card className="p-4">
              <CardRow
                left={
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Tv className="h-6 w-6" /> OTT Pack
                  </div>
                }
                right={<Toggle checked={ottOn} onChange={setOttOn} />}
              />
              <div className="mt-3">
                <Select
                  value={ottSelected}
                  onChange={setOttSelected}
                  options={ottOptions}
                  disabled={!ottOn}
                />
                <div className="mt-2 text-right text-gray-700">₹{Rupee(ottPrice)}</div>
              </div>
            </Card>

            {/* Other bundles with dropdowns */}
            {(
              [
                ["gaming", { label: "Gaming Pack", icon: <Gamepad2 className="h-6 w-6" /> }],
                ["travel", { label: "Travel Data", icon: <Plane className="h-6 w-6" /> }],
                ["ai", { label: "AI Tools", icon: <Brain className="h-6 w-6" /> }],
                ["linkedin", { label: "LinkedIn Premium", icon: <Linkedin className="h-6 w-6" /> }],
                ["cloud", { label: "Cloud Storage", icon: <Cloud className="h-6 w-6" /> }],
                ["fitness", { label: "Fitness & Health", icon: <HeartPulse className="h-6 w-6" /> }],
                ["edu", { label: "Education Pack", icon: <GraduationCap className="h-6 w-6" /> }],
              ]
            ).map(([key, meta]) => {
              const on = bundles[key];
              const options = bundleOptions[key];
              const selectedId = selected[key];
              const price = options.find((o) => o.id === selectedId)?.price ?? 0;
              return (
                <Card key={key} className="p-4">
                  <CardRow
                    left={
                      <>
                        <span className="rounded-xl bg-gray-100 p-2 text-gray-700">{meta.icon}</span>
                        <div className="text-lg font-semibold text-gray-900">{meta.label}</div>
                      </>
                    }
                    right={<Toggle checked={on} onChange={(v) => setBundles({ ...bundles, [key]: v })} />}
                  />
                  <div className="mt-3">
                    <Select
                      value={selectedId}
                      onChange={(id) => setSelected({ ...selected, [key]: id })}
                      options={options}
                      disabled={!on}
                    />
                    <div className="mt-2 text-right text-gray-700">₹{Rupee(price)}</div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Spend Cap */}
        <div className="mt-8">
          <SectionTitle>Set Monthly Spend Cap</SectionTitle>
          <div className="mt-4">
            <Range value={cap} min={500} max={3000} step={50} onChange={setCap} />
            <div className="mt-1 text-right text-lg font-semibold text-gray-700">₹{Rupee(cap)}</div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="sticky bottom-0 mt-6">
          <button
            className="w-full rounded-2xl bg-red-600 px-6 py-4 text-center text-lg font-extrabold text-white shadow hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Confirm Plan & Activate · ₹{Rupee(total)}/mo
          </button>
        </div>
      </div>
    </div>
  );
}
