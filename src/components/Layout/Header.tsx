'use client';

import { 
  SignedIn, 
  SignedOut, 
  UserButton 
} from '@clerk/nextjs';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  onLogoClick: () => void;
}

export function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={onLogoClick}
          >
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">SAT Prep</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button className="text-gray-500 hover:text-gray-900">Dashboard</button>
            <button className="text-gray-500 hover:text-gray-900">Progress</button>
            <button className="text-gray-500 hover:text-gray-900">Practice</button>
            <Link href="/projects" className="text-gray-500 hover:text-gray-900">Projects</Link>
            <button className="text-gray-500 hover:text-gray-900">Settings</button>
          </nav>
          
          <div className="flex items-center space-x-4">
            <SignedOut>
              <Link href="/sign-in" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                Sign In
              </Link>
              <Link href="/sign-up" className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Sign Up
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}