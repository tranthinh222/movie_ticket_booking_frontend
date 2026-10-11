import { beforeEach, describe, expect, it } from "vitest";
import { useAuth } from "./useAuth";

describe("useAuth", () => {
  beforeEach(() => useAuth.setState({ user: null, authenticated: false, isLoading: true }));

  it("sets the user and authenticates atomically", () => {
    const user = { id: 7, username: "An" } as IFetchUserRes;
    useAuth.getState().setUser(user);
    expect(useAuth.getState()).toMatchObject({ user, authenticated: true });
  });

  it("updates flags and clears the session", () => {
    useAuth.getState().setAuthenticated(true);
    useAuth.getState().setLoading(false);
    useAuth.getState().clearUser();
    expect(useAuth.getState()).toMatchObject({ user: null, authenticated: false, isLoading: false });
  });
});
