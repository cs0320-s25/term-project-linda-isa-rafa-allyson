import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/clerk-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          MoodTunes
        </Link>
        <div className="flex items-center space-x-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header; 