import React from 'react';
import { type DemoAccount } from '../appConfig';
import { roleMeta } from '../mockData';

type LoginScreenProps = {
  accounts: DemoAccount[];
  selectedAccount: DemoAccount;
  selectedAccountId: string;
  setSelectedAccountId: (id: string) => void;
  loginForm: {
    email: string;
    password: string;
    otp: string;
  };
  setLoginForm: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
      otp: string;
    }>
  >;
  loginError: string;
  onLogin: () => void;
};

export function LoginScreen({
  accounts,
  selectedAccount,
  selectedAccountId,
  setSelectedAccountId,
  loginForm,
  setLoginForm,
  loginError,
  onLogin,
}: LoginScreenProps) {
  return (
    <div className="login-shell">
      <section className="login-hero">
        <p className="hero-eyebrow">Milestone 2 React prototype</p>
        <h1>BridgeBoard</h1>
        <p className="hero-copy">
          A cleaner prototype for your PM review, starting with a real login page
          and then moving each user into their own role-based workspace.
        </p>
        <div className="hero-points">
          <div className="hero-point">
            <strong>4 demo users</strong>
            <span>Student, employer, course instructor, and administrator.</span>
          </div>
          <div className="hero-point">
            <strong>Separated pages</strong>
            <span>Each section is focused, so the UI is easier to follow and explain.</span>
          </div>
          <div className="hero-point">
            <strong>Dummy data stays rich</strong>
            <span>
              The information is still there, but it is now surfaced in smaller pieces.
            </span>
          </div>
        </div>
      </section>

      <section className="login-card">
        <div className="login-card-head">
          <p>Sign in</p>
          <h2>Choose a demo account</h2>
          <span>Each account opens its own workspace and landing page.</span>
        </div>

        <div className="account-grid">
          {accounts.map((account) => (
            <button
              key={account.id}
              type="button"
              className={`account-card ${
                account.id === selectedAccountId ? 'active' : ''
              }`}
              onClick={() => setSelectedAccountId(account.id)}
            >
              <span>{roleMeta[account.role].label}</span>
              <strong>{account.name}</strong>
              <small>{account.email}</small>
            </button>
          ))}
        </div>

        <div className="form-grid">
          <label>
            Email
            <input
              value={loginForm.email}
              onChange={(event) =>
                setLoginForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
            />
          </label>
          <label className="full-span">
            OTP
            <input
              value={loginForm.otp}
              onChange={(event) =>
                setLoginForm((current) => ({
                  ...current,
                  otp: event.target.value,
                }))
              }
            />
          </label>
        </div>

        {loginError ? <div className="error-banner">{loginError}</div> : null}

        <div className="button-row">
          <button type="button" className="primary-button wide-button" onClick={onLogin}>
            Login as {selectedAccount.name}
          </button>
        </div>

        <div className="login-hint">
          Demo password for this account: <strong>{selectedAccount.password}</strong>
        </div>
      </section>
    </div>
  );
}
