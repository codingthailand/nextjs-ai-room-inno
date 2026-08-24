import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import AppButton from "./app-button";

test("AppButton renders a button with text Click Me!", () => {
  render(<AppButton />);
  expect(
    screen.getByRole("button", { name: "Click Me!" })
  ).toBeInTheDocument();
});
