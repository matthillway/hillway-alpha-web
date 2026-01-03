import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock Supabase before importing the route
const mockSupabaseFrom = vi.fn();
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: mockSupabaseFrom,
  })),
}));

// Import after mocking
import { GET } from "@/app/api/metrics/route";

describe("GET /api/metrics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns dashboard metrics with correct structure", async () => {
    // Mock database responses
    const mockOpportunities = [
      { id: "1", category: "arbitrage", data: { margin: 2.5 } },
      { id: "2", category: "value_bet", data: { margin: 3.0 } },
    ];

    const mockPositions = [
      { id: "1", stake_amount: 100, pnl: 15 },
      { id: "2", stake_amount: 200, pnl: -10 },
    ];

    const mockWeeklyMetrics = [
      { date: "2026-01-01", gross_pnl: 50 },
      { date: "2026-01-02", gross_pnl: 25 },
    ];

    const mockClosedPositions = [{ pnl: 50 }, { pnl: -20 }, { pnl: 30 }];

    // Set up mock chain
    mockSupabaseFrom.mockImplementation((table: string) => {
      if (table === "opportunities") {
        return {
          select: vi.fn(() => ({
            gte: vi.fn(() => ({
              eq: vi.fn(() =>
                Promise.resolve({
                  data: mockOpportunities,
                  count: 2,
                  error: null,
                }),
              ),
            })),
          })),
        };
      }
      if (table === "positions") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn((field: string, value: string) => {
              if (value === "open") {
                return Promise.resolve({ data: mockPositions, error: null });
              }
              if (value === "closed") {
                return Promise.resolve({
                  data: mockClosedPositions,
                  error: null,
                });
              }
              return Promise.resolve({ data: [], error: null });
            }),
          })),
        };
      }
      if (table === "daily_metrics") {
        return {
          select: vi.fn(() => ({
            gte: vi.fn(() =>
              Promise.resolve({ data: mockWeeklyMetrics, error: null }),
            ),
          })),
        };
      }
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
          gte: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      };
    });

    const request = new NextRequest("http://localhost/api/metrics");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("today");
    expect(data).toHaveProperty("positions");
    expect(data).toHaveProperty("performance");
    expect(data).toHaveProperty("summary");
  });

  it("returns 500 on database error", async () => {
    mockSupabaseFrom.mockImplementation(() => {
      throw new Error("Database connection failed");
    });

    const request = new NextRequest("http://localhost/api/metrics");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Internal server error");
  });

  it("handles empty data gracefully", async () => {
    mockSupabaseFrom.mockImplementation(() => ({
      select: vi.fn(() => ({
        gte: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: [], count: 0, error: null })),
        })),
        eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    }));

    const request = new NextRequest("http://localhost/api/metrics");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.today.opportunities).toBe(0);
    expect(data.positions.open).toBe(0);
    expect(data.performance.weekPnl).toBe(0);
  });
});
