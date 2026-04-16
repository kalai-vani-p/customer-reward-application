import { renderHook, act } from "@testing-library/react";
import useDebounce from "../hooks/useDebounce";

jest.useFakeTimers();

describe("useDebounce", () => {
  test("updates value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "A" } }
    );

    rerender({ value: "B" });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("B");
  });

  test("handles invalid delay", () => {
    const { result } = renderHook(() =>
      useDebounce("A", -100)
    );

    expect(result.current).toBe("A");
  });

  test("handles null value", () => {
    const { result } = renderHook(() =>
      useDebounce(null, 300)
    );

    expect(result.current).toBe(null);
  });
});
