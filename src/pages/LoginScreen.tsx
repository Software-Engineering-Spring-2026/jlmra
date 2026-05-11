import React, { useEffect, useState } from 'react';
import { type DemoAccount } from '../appConfig';
import { type CompanyRequest, type Role, roleMeta } from '../mockData';
import { Icon } from '../components/icons';

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
  onRegisterEmployerCompany: (request: CompanyRequest) => void;
};

type SignupRole = Exclude<Role, 'admin'>;

const savedSignupAccountsKey = 'bridgeboard-signup-accounts';

const signupRoleLabels: Record<SignupRole, string> = {
  student: 'Student',
  employer: 'Employer',
  instructor: 'Course Instructor',
};

const roleIcons: Record<Role, 'user' | 'building' | 'portfolio' | 'settings'> = {
  student: 'user',
  employer: 'building',
  instructor: 'portfolio',
  admin: 'settings',
};

export function LoginScreen({
  accounts,
  loginForm,
  setLoginForm,
  loginError,
  onLoginCredentials,
  onVerifyOtp,
  onRegisterEmployerCompany,
}: LoginScreenProps) {
  const [authMode, setAuthMode] = useState<
    'signin' | 'otp' | 'signup' | 'forgot' | 'forgot-otp'
  >('signin');
  const [signupRole, setSignupRole] = useState<SignupRole>('student');
  const [signupForm, setSignupForm] = useState({
    companyName: '',
    companyEmail: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    taxCertificate: '',
    commercialRegister: '',
  });
  const [authNotice, setAuthNotice] = useState('');
  const [signupError, setSignupError] = useState('');

  useEffect(() => {
    try {
      const savedAccounts = window.localStorage.getItem(savedSignupAccountsKey);
      const parsedAccounts = savedAccounts ? JSON.parse(savedAccounts) : [];

      if (Array.isArray(parsedAccounts)) {
        parsedAccounts.forEach((account: DemoAccount) => {
          const accountExists = accounts.some(
            (current) =>
              current.email.toLowerCase() === account.email.toLowerCase()
          );

          if (!accountExists) {
            accounts.push(account);
          }
        });
      }
    } catch {
      window.localStorage.removeItem(savedSignupAccountsKey);
    }
  }, [accounts]);

  const detectedAccount = accounts.find(
    (account) => account.email.toLowerCase() === loginForm.email.trim().toLowerCase()
  );

  const switchMode = (
    mode: 'signin' | 'otp' | 'signup' | 'forgot' | 'forgot-otp'
  ) => {
    setAuthMode(mode);
    setAuthNotice('');
    setSignupError('');
  };

  const updateSignupForm =
    (field: keyof typeof signupForm) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSignupForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const updateSignupFile =
    (field: 'taxCertificate' | 'commercialRegister') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileName = event.target.files?.[0]?.name ?? '';

      setSignupForm((current) => ({
        ...current,
        [field]: fileName,
      }));
    };

  const handleSignupSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email =
      signupRole === 'employer' && signupForm.companyEmail.trim()
        ? signupForm.companyEmail.trim()
        : signupForm.email.trim();

    if (
      !signupForm.firstName.trim() ||
      !signupForm.lastName.trim() ||
      !email ||
      !signupForm.password.trim()
    ) {
      setSignupError('Please fill in the required account details.');
      return;
    }

    if (
      signupRole === 'employer' &&
      (!signupForm.companyName.trim() ||
        !signupForm.companyEmail.trim() ||
        !signupForm.taxCertificate.trim())
    ) {
      setSignupError('Employer registration requires company details and a tax certificate PDF.');
      return;
    }

    if (
      signupRole === 'employer' &&
      !signupForm.taxCertificate.toLowerCase().endsWith('.pdf')
    ) {
      setSignupError('The tax certificate must be uploaded as a PDF.');
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }

    const normalizedEmail = email.toLowerCase();
    const accountExists = accounts.some(
      (account) => account.email.toLowerCase() === normalizedEmail
    );

    if (accountExists) {
      setSignupError('An account with this email already exists.');
      return;
    }

    const nextAccount: DemoAccount = {
      id: `signup-${Date.now()}`,
      role: signupRole,
      name: `${signupForm.firstName.trim()} ${signupForm.lastName.trim()}`.trim(),
      email: normalizedEmail,
      password: signupForm.password.trim(),
      otp: '000000',
      landingPage: 'dashboard',
    };

    accounts.push(nextAccount);
    if (signupRole === 'employer') {
      onRegisterEmployerCompany({
        id: `company-signup-${Date.now()}`,
        companyName: signupForm.companyName.trim(),
        owner: nextAccount.name,
        companyEmail: normalizedEmail,
        address: 'Pending address',
        summary: 'New employer registration submitted from the sign up flow.',
        documents: [
          signupForm.taxCertificate.trim(),
          signupForm.commercialRegister.trim(),
        ].filter(Boolean),
        status: 'Pending',
      });
    }
    window.localStorage.setItem(
      savedSignupAccountsKey,
      JSON.stringify(accounts.filter((account) => account.id.startsWith('signup-')))
    );
    setLoginForm({ email: normalizedEmail, password: signupForm.password.trim(), otp: '' });
    setSignupForm({
      companyName: '',
      companyEmail: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      taxCertificate: '',
      commercialRegister: '',
    });
    setSignupError('');
    setAuthNotice('Account created. Sign in with OTP 000000.');
    setAuthMode('signin');
  };

  return (
    <div className="login-shell">
      <section className="login-card">
        <div className="login-intro">
          <div className="brand-block brand-block-login">
            <p>BridgeBoard</p>
            <h1>Portfolio</h1>
          </div>
          <div className="login-card-head">
            <p>
              {authMode === 'signin'
                ? 'Welcome back'
                : authMode === 'otp'
                ? 'Verification'
                : authMode === 'signup'
                ? 'New account'
                : 'Password reset'}
            </p>
            <h2>
              {authMode === 'signin'
                ? 'Sign in'
                : authMode === 'otp'
                ? 'Enter OTP'
                : authMode === 'signup'
                ? 'Create account'
                : authMode === 'forgot'
                ? 'Forgot password'
                : 'Reset password'}
            </h2>
            <span>
              {authMode === 'signin'
                ? 'Use your email and password.'
                : authMode === 'otp'
                ? 'Enter the verification code.'
                : authMode === 'signup'
                ? 'Choose the account type and fill the form.'
                : authMode === 'forgot'
                ? 'Send a reset code to your email.'
                : 'Enter the reset code and new password.'}
            </span>
          </div>
        </div>

        <div className="auth-tabs" aria-label="Authentication options">
          <button
            type="button"
            className={`auth-tab ${
              authMode === 'signin' || authMode === 'otp' ? 'active' : ''
            }`}
            onClick={() => switchMode('signin')}
          >
            <Icon name="key" />
            Sign in
          </button>
          <button
            type="button"
            className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            <Icon name="signup" />
            Sign up
          </button>
        </div>

        {authMode === 'signin' ? (
          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (onLoginCredentials()) {
                setAuthNotice('OTP sent to your email.');
                setAuthMode('otp');
              }
            }}
          >
            <div className="form-grid">
              <label className="full-span">
                Email
                <input
                  type="email"
                  value={loginForm.email}
                  placeholder="Enter email"
                  autoComplete="email"
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="full-span">
                Password
                <input
                  type="password"
                  value={loginForm.password}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  onChange={(event) =>
                    setLoginForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div className="login-meta-row">
              <div className="detected-role">
                <Icon name={detectedAccount ? roleIcons[detectedAccount.role] : 'user'} />
                <span>
                  {detectedAccount
                    ? `${roleMeta[detectedAccount.role].label} detected`
                    : 'Role detected after email match'}
                </span>
              </div>
              <button
                type="button"
                className="text-button"
                onClick={() => switchMode('forgot')}
              >
                Forgot password?
              </button>
            </div>

            {loginError ? <div className="error-banner">{loginError}</div> : null}

            <button type="submit" className="primary-button wide-button">
              <Icon name="key" />
              Continue
            </button>
          </form>
        ) : null}

        {authMode === 'otp' ? (
          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              onVerifyOtp();
            }}
          >
            <div className="form-grid">
              <label className="full-span">
                OTP
                <input
                  value={loginForm.otp}
                  placeholder="Enter OTP"
                  inputMode="numeric"
                  autoComplete="one-time-code"
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
              <button type="submit" className="primary-button">
                <Icon name="check" />
                Verify OTP
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
        ) : null}

        {authMode === 'signup' ? (
          <form className="auth-form" onSubmit={handleSignupSubmit}>
            <div className="role-picker" aria-label="Choose registration role">
              {(['student', 'employer', 'instructor'] as SignupRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`role-choice ${signupRole === role ? 'active' : ''}`}
                  onClick={() => {
                    setSignupRole(role);
                    setSignupError('');
                  }}
                >
                  <Icon
                    name={
                      role === 'student'
                        ? 'user'
                        : role === 'employer'
                        ? 'building'
                        : 'portfolio'
                    }
                  />
                  {signupRoleLabels[role]}
                </button>
              ))}
            </div>

            <div className="form-grid" key={signupRole}>
              {signupRole === 'employer' ? (
                <>
                  <label>
                    Company name
                    <input
                      value={signupForm.companyName}
                      placeholder="Enter company name"
                      onChange={updateSignupForm('companyName')}
                    />
                  </label>
                  <label>
                    Company email
                    <input
                      type="email"
                      value={signupForm.companyEmail}
                      placeholder="Enter company email"
                      onChange={updateSignupForm('companyEmail')}
                    />
                  </label>
                  <label>
                    Tax certificate PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={updateSignupFile('taxCertificate')}
                    />
                    {signupForm.taxCertificate ? (
                      <span className="subtle-copy">{signupForm.taxCertificate}</span>
                    ) : null}
                  </label>
                  <label>
                    Commercial register PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={updateSignupFile('commercialRegister')}
                    />
                    {signupForm.commercialRegister ? (
                      <span className="subtle-copy">{signupForm.commercialRegister}</span>
                    ) : null}
                  </label>
                </>
              ) : null}

              <label>
                First name
                <input
                  value={signupForm.firstName}
                  placeholder="Enter first name"
                  onChange={updateSignupForm('firstName')}
                />
              </label>
              <label>
                Last name
                <input
                  value={signupForm.lastName}
                  placeholder="Enter last name"
                  onChange={updateSignupForm('lastName')}
                />
              </label>
              <label className="full-span">
                Email
                <input
                  type="email"
                  value={signupForm.email}
                  placeholder="Enter email"
                  onChange={updateSignupForm('email')}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={signupForm.password}
                  placeholder="Enter password"
                  onChange={updateSignupForm('password')}
                />
              </label>
              <label>
                Confirm password
                <input
                  type="password"
                  value={signupForm.confirmPassword}
                  placeholder="Confirm password"
                  onChange={updateSignupForm('confirmPassword')}
                />
              </label>
            </div>

            {signupError ? <div className="error-banner">{signupError}</div> : null}

            <button type="submit" className="primary-button wide-button">
              <Icon name="signup" />
              Create account
            </button>
          </form>
        ) : null}

        {authMode === 'forgot' ? (
          <div className="auth-form">
            <div className="form-grid">
              <label className="full-span">
                Email
                <input type="email" placeholder="Enter email" />
              </label>
            </div>
            <div className="button-row">
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  setAuthNotice('Password reset OTP sent.');
                  setAuthMode('forgot-otp');
                }}
              >
                <Icon name="mail" />
                Send OTP
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => switchMode('signin')}
              >
                Back to sign in
              </button>
            </div>
          </div>
        ) : null}

        {authMode === 'forgot-otp' ? (
          <div className="auth-form">
            <div className="form-grid">
              <label className="full-span">
                OTP
                <input placeholder="Enter OTP" inputMode="numeric" />
              </label>
              <label>
                New password
                <input type="password" placeholder="Enter new password" />
              </label>
              <label className="full-span">
                Confirm password
                <input type="password" placeholder="Confirm new password" />
              </label>
            </div>
            <div className="button-row">
              <button
                type="button"
                className="primary-button"
                onClick={() => setAuthNotice('Password updated.')}
              >
                <Icon name="check" />
                Update password
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => switchMode('forgot')}
              >
                Back
              </button>
            </div>
          </div>
        ) : null}

        {authNotice ? <div className="notice-banner">{authNotice}</div> : null}
      </section>
    </div>
  );
}
