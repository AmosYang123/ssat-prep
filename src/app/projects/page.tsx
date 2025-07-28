'use client';

import { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { BookOpen, Gamepad2, Circle, ArrowLeft, ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  technologies: string[];
  status: 'active' | 'completed' | 'in-progress';
  lastUpdated: string;
}

const projects: Project[] = [
  {
    id: 'sat-test',
    name: 'SAT Test Prep',
    description: 'A comprehensive SAT and SSAT test preparation application with adaptive learning, reading comprehension, and vocabulary drills.',
    icon: <BookOpen className="h-8 w-8 text-blue-600" />,
    path: '/',
    technologies: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Clerk Auth'],
    status: 'active',
    lastUpdated: 'July 26, 2024'
  },
  {
    id: 'clash-clone',
    name: 'Clash Clone',
    description: 'A Clash of Clans inspired game with strategic gameplay and resource management.',
    icon: <Gamepad2 className="h-8 w-8 text-green-600" />,
    path: '../clash_clone',
    technologies: ['React', 'JavaScript', 'CSS'],
    status: 'in-progress',
    lastUpdated: 'July 26, 2024'
  },
  {
    id: 'nba-stats',
    name: 'NBA Shooting Game',
    description: 'An interactive NBA statistics and shooting game with player data and performance tracking.',
    icon: <Circle className="h-8 w-8 text-orange-600" />,
    path: '../nba_stats/nba-shooting-game',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    status: 'completed',
    lastUpdated: 'July 17, 2024'
  }
];

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogoClick={() => window.location.href = '/'} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to SAT Prep</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-2">A collection of my development work and experiments</p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              {/* Project Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  {project.icon}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{project.description}</p>
              </div>

              {/* Technologies */}
              <div className="p-6 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Updated: {project.lastUpdated}
                  </span>
                  <div className="flex space-x-2">
                    {project.id === 'sat-test' ? (
                      <Link
                        href={project.path}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Open App
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          // For external projects, we could open them in a new window
                          // or navigate to their directory
                          alert(`This would open: ${project.path}`);
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Project Button */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Github className="h-4 w-4 mr-2" />
            Add New Project
          </button>
        </div>
      </main>
    </div>
  );
} 