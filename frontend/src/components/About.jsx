import { useState, useEffect } from 'react';

// Custom icon components
const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// Particle animation component
const ParticlesBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-500 opacity-20"
          style={{
            width: `${Math.random() * 10 + 3}px`,
            height: `${Math.random() * 10 + 3}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 15 + 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function AboutUs() {
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  // Initialize animations after component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Sample team data with 3 members
  const teamMembers = [
    {
      id: 1,
      name: "Prajwal Prakash Shetti",
      image: "/prajwal.jpg",
      socials: {
        github: "https://github.com/prajwalshetti",
        linkedin: "https://www.linkedin.com/in/prajwal-shetti-b1aa2625a/",
        instagram: "https://www.instagram.com/prajwalshetti_8104?igsh=OTlhNGVzZjBzNTNo"
      }
    },
    {
      id: 2,
      name: "Prasanna Prasad Shenoy",
      image: "/prasanna.jpg",
      socials: {
        github: "https://github.com/PrasannaPrasadShenoy",
        linkedin: "https://www.linkedin.com/in/prasanna-prasad-shenoy-0a5b87261/",
        instagram: "https://www.chess.com/member/prasanna162004"
      }
    },
    {
      id: 3,
      name: "Pranav Shivanand Patil",
      image: "/pranav.jpg",
      socials: {
        github: "https://github.com/Pranav150604/",
        linkedin: "https://www.linkedin.com/in/pranav-patil-a61048278/",
        instagram: "https://www.instagram.com/pranavpatil_15?igsh=MWhpZnZ5M3R1b3Uybw%3D%3D&utm_source=qr"
      }
    }
  ];

  // Handle touch events for mobile
  const handleTouchStart = (id) => {
    setActiveCard(id);
  };

  const handleTouchEnd = () => {
    setActiveCard(null);
  };

  // Custom styles for card animations
  const getCardStyles = (id) => {
    const isCardActive = activeCard === id;
    
    return {
      transform: isCardActive ? 'translateY(-5px)' : 'translateY(0)',
      boxShadow: isCardActive 
        ? '0 10px 15px -3px rgba(139, 92, 246, 0.2), 0 4px 6px -2px rgba(139, 92, 246, 0.1)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <ParticlesBackground />
      <div className="absolute top-0 left-0 w-full h-32 sm:h-64 bg-gradient-to-b from-purple-900/30 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-32 sm:h-64 bg-gradient-to-t from-indigo-900/30 to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-5">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
            Meet Our Team
          </h1>
          <div className="h-1 w-20 sm:w-32 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 mx-auto"></div>
        </div>

        {/* Team Members Section - Cards side by side on desktop, stacked on mobile */}
        <div className="flex flex-col lg:flex-row lg:justify-center lg:gap-8 space-y-6 lg:space-y-0 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div 
              key={member.id}
              className={`w-full max-w-xs mx-auto lg:flex-1 lg:max-w-sm lg:mx-0 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
              onMouseEnter={() => setActiveCard(member.id)}
              onMouseLeave={() => setActiveCard(null)}
              onTouchStart={() => handleTouchStart(member.id)}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="bg-gray-800/70 backdrop-blur-sm rounded-xl overflow-hidden border-2 border-gray-700 h-full"
                style={getCardStyles(member.id)}
              >
                {/* Profile Image */}
                <div className="relative h-80 sm:h-96 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="object-cover object-center w-full h-full transform transition-transform duration-700 ease-out"
                    style={{
                      transform: activeCard === member.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                  />
                </div>

                {/* Content - Name and Social Links */}
                <div className="p-6 relative">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center text-white">
                    {member.name}
                  </h3>
                  
                  {/* Social Icons */}
                  <div className="flex justify-center space-x-6">
                    <a 
                      href={member.socials.github} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                    >
                      <GitHubIcon />
                    </a>
                    <a 
                      href={member.socials.linkedin} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
                    >
                      <LinkedinIcon />
                    </a>
                    <a 
                      href={member.socials.instagram} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-pink-400 transition-all duration-300 transform hover:scale-110"
                    >
                      <InstagramIcon />
                    </a>
                  </div>
                </div>

                {/* Animated border accent */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 transition-all duration-700 ease-out"
                  style={{ 
                    width: activeCard === member.id ? '100%' : '0%',
                    opacity: activeCard === member.id ? '1' : '0'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-15px) translateX(7px);
          }
          50% {
            transform: translateY(0) translateX(15px);
          }
          75% {
            transform: translateY(15px) translateX(7px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  );
}