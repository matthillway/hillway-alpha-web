"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tag,
  RefreshCw,
  Plus,
  Trash2,
  X,
  Check,
  Calendar,
  Percent,
  PoundSterling,
  Users,
} from "lucide-react";

interface DiscountCode {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  max_uses: number | null;
  uses: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  created_by: string;
}

interface CreateCodeForm {
  code: string;
  type: "percentage" | "fixed";
  value: string;
  max_uses: string;
  expires_at: string;
}

const initialFormState: CreateCodeForm = {
  code: "",
  type: "percentage",
  value: "",
  max_uses: "",
  expires_at: "",
};

export default function DiscountCodesPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState<CreateCodeForm>(initialFormState);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCodes(data as DiscountCode[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      const newCode = {
        code: form.code.toUpperCase(),
        type: form.type,
        value: parseFloat(form.value),
        max_uses: form.max_uses ? parseInt(form.max_uses) : null,
        expires_at: form.expires_at || null,
        is_active: true,
        uses: 0,
        created_by: user.id,
      };

      const { error: insertError } = await supabase
        .from("discount_codes")
        .insert([newCode]);

      if (insertError) throw insertError;

      setShowCreateModal(false);
      setForm(initialFormState);
      fetchCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create code");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (code: DiscountCode) => {
    const { error } = await supabase
      .from("discount_codes")
      .update({ is_active: !code.is_active })
      .eq("id", code.id);

    if (!error) {
      fetchCodes();
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (!confirm("Are you sure you want to delete this code?")) return;

    const { error } = await supabase
      .from("discount_codes")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchCodes();
    }
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm({ ...form, code: result });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Discount Codes</h1>
          <p className="text-gray-400 mt-1">
            Create and manage promotional discount codes
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchCodes}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Code</span>
          </Button>
        </div>
      </div>

      {/* Codes Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Code
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Type
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Value
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Usage
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Expires
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <RefreshCw className="w-6 h-6 text-gray-500 animate-spin mx-auto" />
                    <p className="text-gray-500 mt-2">Loading codes...</p>
                  </td>
                </tr>
              ) : codes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Tag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">No discount codes yet</p>
                    <Button
                      variant="primary"
                      onClick={() => setShowCreateModal(true)}
                      className="mt-4"
                    >
                      Create Your First Code
                    </Button>
                  </td>
                </tr>
              ) : (
                codes.map((code) => (
                  <tr
                    key={code.id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-emerald-500" />
                        <span className="text-white font-mono font-medium">
                          {code.code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          code.type === "percentage"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {code.type === "percentage" ? (
                          <span className="flex items-center space-x-1">
                            <Percent className="w-3 h-3" />
                            <span>Percentage</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1">
                            <PoundSterling className="w-3 h-3" />
                            <span>Fixed</span>
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">
                        {code.type === "percentage"
                          ? `${code.value}%`
                          : `£${code.value}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <Users className="w-4 h-4" />
                        <span>
                          {code.uses}
                          {code.max_uses
                            ? ` / ${code.max_uses}`
                            : " (unlimited)"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {code.expires_at ? (
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(code.expires_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Never</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(code)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          code.is_active
                            ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                            : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                        }`}
                      >
                        {code.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteCode(code.id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete code"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">
                Create Discount Code
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setForm(initialFormState);
                  setError(null);
                }}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCode} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Code
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={form.code}
                    onChange={(e) =>
                      setForm({ ...form, code: e.target.value.toUpperCase() })
                    }
                    placeholder="e.g. SUMMER20"
                    required
                    className="flex-1 uppercase"
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="px-3 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Discount Type
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: "percentage" })}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      form.type === "percentage"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                    <span>Percentage</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: "fixed" })}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      form.type === "fixed"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    <PoundSterling className="w-4 h-4" />
                    <span>Fixed Amount</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Value {form.type === "percentage" ? "(%" : "(£"}
                </label>
                <Input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder={form.type === "percentage" ? "20" : "10"}
                  min="0"
                  max={form.type === "percentage" ? "100" : undefined}
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Uses (leave empty for unlimited)
                </label>
                <Input
                  type="number"
                  value={form.max_uses}
                  onChange={(e) =>
                    setForm({ ...form, max_uses: e.target.value })
                  }
                  placeholder="100"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiry Date (optional)
                </label>
                <Input
                  type="date"
                  value={form.expires_at}
                  onChange={(e) =>
                    setForm({ ...form, expires_at: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setForm(initialFormState);
                    setError(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={creating}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Create Code
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
