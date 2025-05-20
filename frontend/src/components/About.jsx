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
  const [animateHeader, setAnimateHeader] = useState(false);

  // Initialize animations after component mounts
  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => setAnimateHeader(true), 300);
  }, []);

  // Sample team data with 3 members
  const teamMembers = [
    {
      id: 1,
      name: "Prajwal Prakash Shetti",
      role: "Full-Stack Developer",
      image: "/prajwal.jpg",
      description: "Full-stack developer with strong problem-solving skills and expertise in React, NodeJs, and cloud architecture.",
      skills: ["React", "NodeJS", "MongoDB", "AWS", "ExpressJS"],
      socials: {
        github: "https://github.com/prajwalshetti",
        linkedin: "https://www.linkedin.com/in/prajwal-shetti-b1aa2625a/",
        instagram: "https://www.instagram.com/prajwalshetti_8104?igsh=OTlhNGVzZjBzNTNo"
      }
    },
    {
      id: 2,
      name: "Prasanna Prasad Shenoy",
      role: "Full-Stack Developer",
      image: "/prasanna.jpg",
      description: "Combining full-stack development expertise with a deep interest in data analytics and statistics.",
      skills: ["JavaScript", "Python", "React", "Data Viz", "SQL"],
      socials: {
        github: "https://github.com/PrasannaPrasadShenoy",
        linkedin: "https://www.linkedin.com/in/prasanna-prasad-shenoy-0a5b87261/",
        instagram: "https://www.chess.com/member/prasanna162004"
      }
    },
    {
      id: 3,
      name: "Pranav Shivanand Patil",
      role: "Full-Stack Developer",
      image: "/pranav.jpg",
      description: "Full-Stack developer with a keen interest in Machine Learning and its real-world applications.",
      skills: ["Python", "ReactJS", "Docker", "ExpressJS", "Microservices"],
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
      
      <div className="relative z-10 container mx-auto px-4 py-6 sm:py-10">
        {/* Animated Header Section */}
        <div className={`text-center mb-10 sm:mb-20 transition-all duration-300`}>
          <h1 className="text-6xl sm:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
            Meet Our Team
          </h1>
          <div className="h-1 w-20 sm:w-32 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 mx-auto"></div>
        </div>

        {/* Team Members Section - Grid for mobile, row for desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {teamMembers.map((member, index) => (
            <div 
              key={member.id}
              className={`w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
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
                {/* Profile Image with Animated Overlay */}
                <div className="relative h-80 sm:h-64 md:h-72 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10 transition-opacity duration-500 ${activeCard === member.id ? 'opacity-70' : 'opacity-50'}`}></div>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="object-cover object-center w-full h-full transform transition-transform duration-700 ease-out"
                    style={{
                      transform: activeCard === member.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                  />
                  
                  {/* Animated profile badge */}
                  <div className={`absolute bottom-4 left-4 z-20 bg-gradient-to-r ${
                    index === 0 ? 'from-purple-600 to-indigo-600' : 
                    index === 1 ? 'from-pink-600 to-purple-600' : 
                    'from-indigo-600 to-blue-600'
                  } px-3 py-1 rounded-full transition-all duration-500 ${
                    activeCard === member.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}>
                    <p className="text-white text-sm font-medium">{member.role}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 relative">
                  <h3 className={`text-xl sm:text-2xl font-bold mb-2 transition-colors duration-500 ${
                    index === 0 ? 'text-purple-300' : 
                    index === 1 ? 'text-pink-300' : 
                    'text-indigo-300'
                  }`}>{member.name}</h3>
                  
                  <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
                    {member.description}
                  </p>
                  
                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-xs sm:text-sm text-gray-400 mb-2">Expertise:</p>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, i) => (
                        <span 
                          key={i} 
                          className={`px-2 py-1 text-xs rounded-full transition-all duration-500 ${
                            activeCard === member.id ? 'bg-opacity-30 transform scale-110' : 'bg-opacity-20'
                          } ${
                            index === 0 ? 'bg-purple-500 text-purple-100' : 
                            index === 1 ? 'bg-pink-500 text-pink-100' : 
                            'bg-indigo-500 text-indigo-100'
                          }`}
                          style={{ transitionDelay: `${i * 50}ms` }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Social Icons with Animated Hover Effect */}
                  <div className="flex space-x-4">
                    <a 
                      href={member.socials.github} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-400 hover:text-white transition-all duration-300 transform ${activeCard === member.id ? 'hover:-translate-y-1' : ''}`}
                    >
                      <GitHubIcon />
                    </a>
                    <a 
                      href={member.socials.linkedin} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-400 hover:text-blue-400 transition-all duration-300 transform ${activeCard === member.id ? 'hover:-translate-y-1' : ''}`}
                    >
                      <LinkedinIcon />
                    </a>
                    <a 
                      href={member.socials.instagram} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-400 hover:text-pink-400 transition-all duration-300 transform ${activeCard === member.id ? 'hover:-translate-y-1' : ''}`}
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

        {/* About Company Section with Animation */}
        <div 
          className={`relative mt-10 sm:mt-20 bg-gray-800/70 backdrop-blur-sm rounded-xl p-5 sm:p-8 md:p-10 border-l-4 border-purple-500 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          style={{ transitionDelay: '600ms' }}
        >
          {/* Decorative element */}
          <div className="absolute -top-4 -left-4 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-purple-600 opacity-30 blur-lg"></div>
          <div className="absolute -bottom-4 -right-4 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-indigo-600 opacity-30 blur-lg"></div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Our Mission</h2>
          <div className="prose prose-sm sm:prose-base md:prose-lg prose-invert max-w-none">
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
              Founded with a passion for technology and innovation, our small but mighty team brings together diverse talents united by a common vision: creating exceptional digital experiences that make a difference.
            </p>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
              We specialize in full-stack development, machine learning, and data analytics, allowing us to deliver comprehensive solutions that meet the evolving needs of our clients.
            </p>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">
              By staying at the forefront of technological advancements and embracing continuous learning, we transform complex challenges into elegant, efficient solutions that drive real value.
            </p>
          </div>
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