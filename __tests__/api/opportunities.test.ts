import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Create a chainable mock that returns itself for all methods
function createChainableMock(resolvedValue: {
  data: unknown;
  error: unknown;
  count: number | null;
}) {
  const chainable: Record<string, unknown> = {};
  const methods = [
    "select",
    "order",
    "range",
    "eq",
    "or",
    "gte",
    "lte",
    "lt",
    "gt",
  ];

  // Make it thenable (awaitable)
  chainable.then = (resolve: (value: unknown) => void) => {
    resolve(resolvedValue);
    return chainable;
  };

  // Add all chainable methods
  methods.forEach((method) => {
    chainable[method] = vi.fn(() => chainable);
  });

  return chainable;
}

// Mock Supabase before importing the route
let mockResolvedValue = { data: [], error: null, count: 0 };
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => createChainableMock(mockResolvedValue)),
  })),
}));

// Import after mocking
import { GET } from "@/app/api/opportunities/route";

describe("GET /api/opportunities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResolvedValue = { data: [], error: null, count: 0 };
  });

  it("returns opportunities list with pagination", async () => {
    const mockOpportunities = [
      {
        id: "1",
        category: "arbitrage",
        title: "Man United vs Chelsea",
        description: "2.5% margin found",
        confidence_score: 85,
        expected_value: 25,
        status: "open",
        created_at: "2026-01-03T10:00:00Z",
        expires_at: "2026-01-03T22:00:00Z",
      },
      {
        id: "2",
        category: "value_bet",
        title: "Liverpool to Win",
        description: "Value detected at 2.1 odds",
        confidence_score: 72,
        expected_value: 15,
        status: "open",
        created_at: "2026-01-03T09:00:00Z",
        expires_at: null,
      },
    ];

    mockResolvedValue = {
      data: mockOpportunities,
      error: null,
      count: 2,
    };

    const request = new NextRequest("http://localhost/api/opportunities");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("opportunities");
    expect(data).toHaveProperty("total");
    expect(data).toHaveProperty("limit");
    expect(data).toHaveProperty("offset");
    expect(data.opportunities).toHaveLength(2);
  });

  it("applies category filter correctly", async () => {
    mockResolvedValue = {
      data: [{ id: "1", category: "arbitrage" }],
      error: null,
      count: 1,
    };

    const request = new NextRequest(
      "http://localhost/api/opportunities?category=arbitrage",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.opportunities[0].category).toBe("arbitrage");
  });

  it("applies status filter correctly", async () => {
    mockResolvedValue = {
      data: [{ id: "1", status: "closed" }],
      error: null,
      count: 1,
    };

    const request = new NextRequest(
      "http://localhost/api/opportunities?status=closed",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.opportunities[0].status).toBe("closed");
  });

  it("handles pagination parameters", async () => {
    mockResolvedValue = {
      data: [],
      error: null,
      count: 100,
    };

    const request = new NextRequest(
      "http://localhost/api/opportunities?limit=10&offset=20",
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.limit).toBe(10);
    expect(data.offset).toBe(20);
  });

  it("returns empty array when no opportunities found", async () => {
    mockResolvedValue = {
      data: [],
      error: null,
      count: 0,
    };

    const request = new NextRequest("http://localhost/api/opportunities");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.opportunities).toEqual([]);
    expect(data.total).toBe(0);
  });

  it("returns 500 on database error", async () => {
    mockResolvedValue = {
      data: null,
      error: { message: "Database error" },
      count: null,
    };

    const request = new NextRequest("http://localhost/api/opportunities");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Failed to fetch opportunities");
  });
});
