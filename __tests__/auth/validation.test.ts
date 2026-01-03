import { describe, it, expect } from "vitest";

// Extract validation logic for testing
// These match the validation functions in the login/signup pages

function validateEmail(email: string): { valid: boolean; error: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { valid: false, error: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }
  return { valid: true, error: "" };
}

function validateLoginPassword(password: string): {
  valid: boolean;
  error: string;
} {
  if (!password) {
    return { valid: false, error: "Password is required" };
  }
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }
  return { valid: true, error: "" };
}

function validateSignupPassword(
  password: string,
  confirmPassword: string,
): { valid: boolean; error: string } {
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }
  if (password !== confirmPassword) {
    return { valid: false, error: "Passwords do not match" };
  }
  return { valid: true, error: "" };
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-orange-500" };
  if (score <= 3) return { score, label: "Good", color: "bg-yellow-500" };
  if (score <= 4) return { score, label: "Strong", color: "bg-green-500" };
  return { score, label: "Excellent", color: "bg-emerald-500" };
}

describe("Email Validation", () => {
  it("rejects empty email", () => {
    const result = validateEmail("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Email is required");
  });

  it("rejects email without @", () => {
    const result = validateEmail("testexample.com");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Please enter a valid email address");
  });

  it("rejects email without domain", () => {
    const result = validateEmail("test@");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Please enter a valid email address");
  });

  it("rejects email without TLD", () => {
    const result = validateEmail("test@example");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Please enter a valid email address");
  });

  it("rejects email with spaces", () => {
    const result = validateEmail("test @example.com");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Please enter a valid email address");
  });

  it("accepts valid email", () => {
    const result = validateEmail("test@example.com");
    expect(result.valid).toBe(true);
    expect(result.error).toBe("");
  });

  it("accepts email with subdomain", () => {
    const result = validateEmail("test@mail.example.com");
    expect(result.valid).toBe(true);
    expect(result.error).toBe("");
  });

  it("accepts email with plus addressing", () => {
    const result = validateEmail("test+tag@example.com");
    expect(result.valid).toBe(true);
    expect(result.error).toBe("");
  });
});

describe("Login Password Validation", () => {
  it("rejects empty password", () => {
    const result = validateLoginPassword("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Password is required");
  });

  it("rejects password shorter than 8 characters", () => {
    const result = validateLoginPassword("1234567");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Password must be at least 8 characters");
  });

  it("accepts password with exactly 8 characters", () => {
    const result = validateLoginPassword("12345678");
    expect(result.valid).toBe(true);
    expect(result.error).toBe("");
  });

  it("accepts password longer than 8 characters", () => {
    const result = validateLoginPassword("MySecurePassword123!");
    expect(result.valid).toBe(true);
    expect(result.error).toBe("");
  });
});

describe("Signup Password Validation", () => {
  it("rejects password shorter than 8 characters", () => {
    const result = validateSignupPassword("1234567", "1234567");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Password must be at least 8 characters");
  });

  it("rejects mismatched passwords", () => {
    const result = validateSignupPassword("Password123!", "DifferentPassword!");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Passwords do not match");
  });

  it("accepts matching passwords of 8+ characters", () => {
    const result = validateSignupPassword(
      "MySecurePass123!",
      "MySecurePass123!",
    );
    expect(result.valid).toBe(true);
    expect(result.error).toBe("");
  });
});

describe("Password Strength Calculator", () => {
  it("rates empty password as Weak", () => {
    const result = getPasswordStrength("");
    expect(result.label).toBe("Weak");
    expect(result.score).toBe(0);
  });

  it("rates short password as Weak", () => {
    const result = getPasswordStrength("abc");
    expect(result.label).toBe("Weak");
    expect(result.score).toBeLessThanOrEqual(1);
  });

  it("rates 8-char lowercase only as Weak", () => {
    const result = getPasswordStrength("abcdefgh");
    expect(result.label).toBe("Weak");
    expect(result.score).toBe(1);
  });

  it("rates 12-char with mixed case as Good", () => {
    const result = getPasswordStrength("AbcdefghIjkl");
    expect(result.label).toBe("Good");
    expect(result.score).toBe(3);
  });

  it("rates password with all requirements as Strong/Excellent", () => {
    const result = getPasswordStrength("SecurePass123!");
    expect(result.score).toBeGreaterThanOrEqual(4);
    expect(["Strong", "Excellent"]).toContain(result.label);
  });

  it("rates password with length, mixed case, numbers, and symbols as Excellent", () => {
    const result = getPasswordStrength("MyV3ryS3cur3P@ssw0rd!");
    expect(result.label).toBe("Excellent");
    expect(result.score).toBe(5);
  });

  it("increments score for each requirement met", () => {
    // Only length 8
    expect(getPasswordStrength("abcdefgh").score).toBe(1);

    // Length 8 + mixed case
    expect(getPasswordStrength("Abcdefgh").score).toBe(2);

    // Length 8 + mixed case + number
    expect(getPasswordStrength("Abcdefg1").score).toBe(3);

    // Length 8 + mixed case + number + symbol
    expect(getPasswordStrength("Abcdef1!").score).toBe(4);

    // Length 12 + mixed case + number + symbol
    expect(getPasswordStrength("Abcdefghij1!").score).toBe(5);
  });
});
