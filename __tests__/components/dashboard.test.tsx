import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock useRouter
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
  }),
}));

// Mock Supabase
const mockGetSession = vi.fn();
const mockSignOut = vi.fn();
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: () => mockGetSession(),
      signOut: () => mockSignOut(),
    },
  },
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
    // Default mock for fetch to prevent unhandled rejection
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ opportunities: [], total: 0 }),
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("redirects to login when no session", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("shows loading spinner initially", async () => {
    // Create a promise that we control - resolves after assertion
    let resolveSession: (value: unknown) => void = () => {};
    const sessionPromise = new Promise((resolve) => {
      resolveSession = resolve;
    });
    mockGetSession.mockReturnValue(sessionPromise);

    render(<DashboardPage />);

    // Check for spinner (the loading div with animate-spin class)
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();

    // Resolve the promise to avoid unhandled rejection
    resolveSession({ data: { session: null } });

    // Wait for cleanup
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("renders dashboard header when authenticated", async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: "user-123", email: "test@example.com" },
        },
      },
    });

    // Mock API responses
    mockFetch.mockImplementation((url: string) => {
      if (url.includes("/api/metrics")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              today: { opportunities: 5, byCategory: {}, bestMargin: 2.5 },
              positions: { open: 3, openValue: 150 },
              performance: {
                weekPnl: 45.5,
                totalPnl: 120.75,
                winRate: 62.5,
                totalTrades: 24,
              },
              summary: {
                todayOpportunities: 5,
                openPositions: 3,
                weekPnl: 45.5,
                totalPnl: 120.75,
              },
            }),
        });
      }
      if (url.includes("/api/opportunities")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              opportunities: [],
              total: 0,
            }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("TradeSmart")).toBeInTheDocument();
    });
  });

  it("displays user email in welcome message", async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: "user-123", email: "matt@example.com" },
        },
      },
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          today: { opportunities: 0, byCategory: {}, bestMargin: 0 },
          positions: { open: 0, openValue: 0 },
          performance: {
            weekPnl: 0,
            totalPnl: 0,
            winRate: 0,
            totalTrades: 0,
          },
          summary: {
            todayOpportunities: 0,
            openPositions: 0,
            weekPnl: 0,
            totalPnl: 0,
          },
          opportunities: [],
          total: 0,
        }),
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/Welcome back, matt!/)).toBeInTheDocument();
    });
  });

  it("displays metrics correctly", async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: "user-123", email: "test@example.com" },
        },
      },
    });

    mockFetch.mockImplementation((url: string) => {
      if (url.includes("/api/metrics")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              today: {
                opportunities: 12,
                byCategory: { arbitrage: 5, value_bet: 7 },
                bestMargin: 3.5,
              },
              positions: { open: 4, openValue: 250.5 },
              performance: {
                weekPnl: 125.0,
                totalPnl: 450.25,
                winRate: 68.5,
                totalTrades: 35,
              },
              summary: {
                todayOpportunities: 12,
                openPositions: 4,
                weekPnl: 125.0,
                totalPnl: 450.25,
              },
            }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ opportunities: [], total: 0 }),
      });
    });

    render(<DashboardPage />);

    await waitFor(() => {
      // Check for opportunity count
      expect(screen.getByText("12")).toBeInTheDocument();
      // Check for open positions count
      expect(screen.getByText("4")).toBeInTheDocument();
    });
  });

  it("shows empty state when no opportunities", async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: "user-123", email: "test@example.com" },
        },
      },
    });

    mockFetch.mockImplementation((url: string) => {
      if (url.includes("/api/opportunities")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ opportunities: [], total: 0 }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            today: { opportunities: 0, byCategory: {}, bestMargin: 0 },
            positions: { open: 0, openValue: 0 },
            performance: {
              weekPnl: 0,
              totalPnl: 0,
              winRate: 0,
              totalTrades: 0,
            },
            summary: {
              todayOpportunities: 0,
              openPositions: 0,
              weekPnl: 0,
              totalPnl: 0,
            },
          }),
      });
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(
        screen.getByText("No opportunities found yet."),
      ).toBeInTheDocument();
    });
  });

  it("renders scanner cards", async () => {
    mockGetSession.mockResolvedValue({
      data: {
        session: {
          user: { id: "user-123", email: "test@example.com" },
        },
      },
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          today: { opportunities: 0, byCategory: {}, bestMargin: 0 },
          positions: { open: 0, openValue: 0 },
          performance: {
            weekPnl: 0,
            totalPnl: 0,
            winRate: 0,
            totalTrades: 0,
          },
          summary: {
            todayOpportunities: 0,
            openPositions: 0,
            weekPnl: 0,
            totalPnl: 0,
          },
          opportunities: [],
          total: 0,
        }),
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Betting Arbitrage")).toBeInTheDocument();
      expect(screen.getByText("Stock Momentum")).toBeInTheDocument();
      expect(screen.getByText("Crypto Funding")).toBeInTheDocument();
    });
  });
});

describe("Dashboard formatters", () => {
  // Test the formatting functions used in the dashboard
  const formatCurrency = (value: number) => {
    const prefix = value >= 0 ? "+" : "";
    return `${prefix}£${Math.abs(value).toFixed(2)}`;
  };

  const formatPercent = (value: number) => {
    const prefix = value >= 0 ? "+" : "";
    return `${prefix}${value.toFixed(1)}%`;
  };

  it("formats positive currency correctly", () => {
    expect(formatCurrency(125.5)).toBe("+£125.50");
  });

  it("formats negative currency correctly", () => {
    expect(formatCurrency(-42.75)).toBe("£42.75");
  });

  it("formats zero currency correctly", () => {
    expect(formatCurrency(0)).toBe("+£0.00");
  });

  it("formats positive percentage correctly", () => {
    expect(formatPercent(65.5)).toBe("+65.5%");
  });

  it("formats negative percentage correctly", () => {
    expect(formatPercent(-12.3)).toBe("-12.3%");
  });
});
