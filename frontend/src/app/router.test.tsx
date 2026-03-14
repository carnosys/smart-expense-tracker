import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { AppRouter } from "./router";

test("renders landing route by default", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AppRouter />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("heading", { name: /clear money movement/i }),
  ).toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: /create your account/i })).toHaveLength(2);
  expect(screen.getAllByRole("link", { name: /sign in/i })).toHaveLength(2);
});
