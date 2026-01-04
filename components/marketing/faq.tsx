"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

function FAQAccordion({ question, answer }: FAQItem) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-emerald-600"
      >
        <span className="text-base font-medium text-gray-900 pr-4">
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-5 text-gray-600 leading-relaxed">{answer}</div>
      )}
    </div>
  );
}

export function FAQ({ items }: FAQProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm px-6">
      {items.map((item, index) => (
        <FAQAccordion
          key={index}
          question={item.question}
          answer={item.answer}
        />
      ))}
    </div>
  );
}
