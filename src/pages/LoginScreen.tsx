import React, { useState } from 'react';
import { type DemoAccount } from '../appConfig';
import { type Role, roleMeta } from '../mockData';

type LoginScreenProps = {
  accounts: DemoAccount[];
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
  onLoginCredentials: () => boolean;
  onVerifyOtp: () => void;
};

type SignupRole = Exclude<Role, 'admin'>;

const signupRoleLabels: Record<SignupRole, string> = {
  student: 'Student',
  employer: 'Employer',
  instructor: 'Instructor',
};

const roleIcons: Record<Role, string> = {
  student: '👤',
  employer: '🏢',
  instructor: '🎓',
  admin: '⚙️',
};

export function LoginScreen({
  accounts,
  loginForm,
  setLoginForm,
  loginError,
  onLoginCredentials,
  onVerifyOtp,
}: LoginScreenProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'otp' | 'signup' | 'forgot'>('signin');
  const [signupRole, setSignupRole] = useState<SignupRole>('student');
  const [authNotice, setAuthNotice] = useState('');

  const detectedAccount = accounts.find(
    (account) => account.email.toLowerCase() === loginForm.email.trim().toLowerCase()
  );

  const switchMode = (mode: 'signin' | 'otp' | 'signup' | 'forgot') => {
    setAuthMode(mode);
    setAuthNotice('');
  };

  const handleSigninSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLoginCredentials()) {
      switchMode('otp');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerifyOtp();
  };

  return (
    <div className="login-shell">
      <section className="login-card">
        <div className="brand-block brand-block-login">
          <p>BridgeBoard</p>
          <h1>Portfolio</h1>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${authMode === 'signin' || authMode === 'otp' ? 'active' : ''}`}
            onClick={() => switchMode('signin')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {authMode === 'signin' && (
          <form onSubmit={handleSigninSubmit} className="auth-form">
            <div className="form-grid">
              <label className="full-span">
                Email
                <input
                  type="email"
                  value={loginForm.email}
                  placeholder="Enter your email"
                  onChange={(e) =>
                    setLoginForm((current) => ({ ...current, email: e.target.value }))
                  }
                />
              </label>
              {detectedAccount && (
                <div className="detected-role">
                  <span>{roleIcons[detectedAccount.role]}</span>
                  <span>{roleMeta[detectedAccount.role].label} detected</span>
                </div>
              )}
              <label>
                Password
                <input
                  type="password"
                  value={loginForm.password}
                  placeholder="Enter password"
                  onChange={(e) =>
                    setLoginForm((current) => ({ ...current, password: e.target.value }))
                  }
                />
              </label>
            </div>

            {loginError && <div className="error-banner">{loginError}</div>}

            <div className="button-row">
              <button type="submit" className="primary-button wide-button">
                Continue
              </button>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() => switchMode('forgot')}
            >
              Forgot password?
            </button>
          </form>
        )}

        {authMode === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="auth-form">
            <div className="form-grid">
              <label className="full-span">
                Enter OTP
                <input
                  value={loginForm.otp}
                  placeholder="6-digit code"
                  inputMode="numeric"
                  onChange={(e) =>
                    setLoginForm((current) => ({ ...current, otp: e.target.value }))
                  }
                />
              </label>
            </div>

            {loginError && <div className="error-banner">{loginError}</div>}

            <div className="button-row">
              <button type="submit" className="primary-button wide-button">
                Verify & Login
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => switchMode('signin')}
              >
                Back
              </button>
            </div>
          </form>
        )}

        {authMode === 'signup' && (
          <div className="auth-form">
            <div className="role-picker">
              {(['student', 'employer', 'instructor'] as SignupRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`role-choice ${signupRole === role ? 'active' : ''}`}
                  onClick={() => setSignupRole(role)}
                >
                  <span>{roleIcons[role]}</span>
                  {signupRoleLabels[role]}
                </button>
              ))}
            </div>

            <div className="form-grid">
              {signupRole === 'employer' ? (
                <>
                  <label>
                    Company
                    <input placeholder="Company name" />
                  </label>
                  <label>
                    Company Email
                    <input type="email" placeholder="company@email.com" />
                  </label>
                </>
              ) : (
                <>
                  <label>
                    First Name
                    <input placeholder="First name" />
                  </label>
                  <label>
                    Last Name
                    <input placeholder="Last name" />
                  </label>
                </>
              )}
              <label className="full-span">
                Email
                <input type="email" placeholder="Enter your email" />
              </label>
              <label>
                Password
                <input type="password" placeholder="Create password" />
              </label>
              <label>
                Confirm
                <input type="password" placeholder="Confirm password" />
              </label>
            </div>

            <div className="button-row">
              <button
                type="button"
                className="primary-button wide-button"
                onClick={() => setAuthNotice(`${signupRoleLabels[signupRole]} account created!`)}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {authMode === 'forgot' && (
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); setAuthNotice('Reset link sent!'); }}>
            <div className="form-grid">
              <label className="full-span">
                Email
                <input type="email" placeholder="Enter your email" />
              </label>
            </div>
            <div className="button-row">
              <button type="submit" className="primary-button">
                Send Reset Link
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => switchMode('signin')}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {authNotice && <div className="notice-banner">{authNotice}</div>}
      </section>
    </div>
  );
}
