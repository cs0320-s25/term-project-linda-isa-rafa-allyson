import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} MoodTunes. All rights reserved.</p>
        <div className="mt-2">
          <a
            href="https://github.com/yourusername/moodtunes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 