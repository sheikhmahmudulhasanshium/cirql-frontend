'use client';

import { Button } from '@/components/ui/button';

const SignInPage = () => {
  const handleGoogleSignIn = () => {
    // Redirect to your backend route for Google authentication
    window.location.href = '/api/auth/google'; // This route needs to be implemented
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <Button onClick={handleGoogleSignIn} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Sign in with Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;