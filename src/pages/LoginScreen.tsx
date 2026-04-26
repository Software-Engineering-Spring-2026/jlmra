import React, { useState } from 'react';
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
  const [authMode, setAuthMode] = useState<
    'signin' | 'student-signup' | 'employer-signup' | 'instructor-signup' | 'forgot'
  >('signin');
  const [authNotice, setAuthNotice] = useState('');

  return (
    <div className="login-shell">
      <section className="login-card">
        <div className="brand-block brand-block-login">
          <p>BridgeBoard</p>
          <h1>Portfolio</h1>
        </div>

        <div className="login-card-head">
          <p>
            {authMode === 'signin'
              ? 'Sign in'
              : authMode === 'forgot'
              ? 'Reset password'
              : 'Register'}
          </p>
          <h2>
            {authMode === 'signin'
              ? 'Choose an account'
              : authMode === 'forgot'
              ? 'Forgot password with OTP'
              : 'Create a new account'}
          </h2>
          <span>
            {authMode === 'signin'
              ? 'Each account opens its own role workspace and pages.'
              : authMode === 'forgot'
              ? 'Prototype flow for updating a forgotten password using OTP.'
              : 'Prototype sign-up flows for students, employers, and course instructors.'}
          </span>
        </div>

        <div className="button-row">
          <button
            type="button"
            className={`ghost-button ${authMode === 'signin' ? 'active' : ''}`}
            onClick={() => {
              setAuthMode('signin');
              setAuthNotice('');
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`ghost-button ${authMode === 'student-signup' ? 'active' : ''}`}
            onClick={() => {
              setAuthMode('student-signup');
              setAuthNotice('');
            }}
          >
            Student sign up
          </button>
          <button
            type="button"
            className={`ghost-button ${authMode === 'employer-signup' ? 'active' : ''}`}
            onClick={() => {
              setAuthMode('employer-signup');
              setAuthNotice('');
            }}
          >
            Employer sign up
          </button>
          <button
            type="button"
            className={`ghost-button ${authMode === 'instructor-signup' ? 'active' : ''}`}
            onClick={() => {
              setAuthMode('instructor-signup');
              setAuthNotice('');
            }}
          >
            Instructor sign up
          </button>
          <button
            type="button"
            className={`ghost-button ${authMode === 'forgot' ? 'active' : ''}`}
            onClick={() => {
              setAuthMode('forgot');
              setAuthNotice('');
            }}
          >
            Forgot password
          </button>
        </div>

        {authMode === 'signin' ? (
          <>
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
          </>
        ) : authMode === 'forgot' ? (
          <>
            <div className="form-grid">
              <label>
                Email
                <input defaultValue="lina.hassan@student.guc.edu.eg" />
              </label>
              <label>
                OTP
                <input defaultValue="482190" />
              </label>
              <label>
                New password
                <input type="password" defaultValue="NewPassword123" />
              </label>
              <label>
                Confirm password
                <input type="password" defaultValue="NewPassword123" />
              </label>
            </div>
            <div className="button-row">
              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  setAuthNotice('Password updated with OTP in the prototype flow.')
                }
              >
                Update password
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="form-grid">
              {authMode === 'employer-signup' ? (
                <>
                  <label>
                    Company name
                    <input defaultValue="Aurora Studio" />
                  </label>
                  <label>
                    Company email
                    <input defaultValue="hello@aurorastudio.io" />
                  </label>
                </>
              ) : (
                <>
                  <label>
                    First name
                    <input defaultValue="Nour" />
                  </label>
                  <label>
                    Last name
                    <input defaultValue="Mohmed" />
                  </label>
                  <label className="full-span">
                    Email
                    <input
                      defaultValue={
                        authMode === 'student-signup'
                          ? 'nour.mohmed@student.guc.edu.eg'
                          : 'nour.mohmed@guc.edu.eg'
                      }
                    />
                  </label>
                </>
              )}
              <label>
                Password
                <input type="password" defaultValue="Prototype123" />
              </label>
              <label>
                Confirm password
                <input type="password" defaultValue="Prototype123" />
              </label>
            </div>
            <div className="button-row">
              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  setAuthNotice(
                    authMode === 'employer-signup'
                      ? 'Employer registration draft created with document upload expected next.'
                      : 'Account registration draft created for the prototype.'
                  )
                }
              >
                Create account
              </button>
            </div>
          </>
        )}

        {authNotice ? <div className="notice-banner">{authNotice}</div> : null}
      </section>
    </div>
  );
}
