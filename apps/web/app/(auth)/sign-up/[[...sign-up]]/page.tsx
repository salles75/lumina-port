import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
      <div className="w-full max-w-md p-4 clerk-theme-wrapper">
        <SignUp
          appearance={{
            variables: {
              colorPrimary: '#22c55e',
              colorTextOnPrimaryBackground: '#ffffff',
            },
            elements: {
              formButtonPrimary:
                'bg-green-500 hover:bg-green-600 text-white',
              card: 'shadow-xl border rounded-2xl',
              footerActionLink: 'text-green-500 hover:text-green-600',
            },
          }}
        />
      </div>
    </div>
  );
}
