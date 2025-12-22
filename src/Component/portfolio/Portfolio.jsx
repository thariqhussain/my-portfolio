import React, { useState, useEffect, useMemo } from 'react';
import './Portfolio.css';
import jsLogo from '../../assets/experience_logo/JavaScript.png'
import reactLogo from '../../assets/experience_logo/React.png'
import htmlLogo from '../../assets/experience_logo/HTML5.png'
import cssLogo from '../../assets/experience_logo/CSS3.png'
import githubIcon from '../../assets/experience_logo/gitWhite.png'
import postmanIcon from '../../assets/experience_logo/Postman.png'
import bootstrapLogo from '../../assets/experience_logo/Bootstrap.png'
import nodejsIcon from '../../assets/experience_logo/Nodejs.png'
import mysqlIcon from '../../assets/experience_logo/MySQL.png'
import antiGravityIcon from '../../assets/experience_logo/antiGravity.png'
import claudeAIIcon from '../../assets/experience_logo/claudeAI.png'
import geminiIcon from '../../assets/experience_logo/geminiAI.png'
import chatgptIcon from '../../assets/experience_logo/chatgpt.png'

import entitiesImg from '../../assets/invoice-generator-images/entities.png'
import entitiesImg2 from '../../assets/invoice-generator-images/entities2.png'
import invoicePDFPreviewImg from '../../assets/invoice-generator-images/invoicePDFPreview.png'
import invoiceWebPreviewImg from '../../assets/invoice-generator-images/invoiceWebPreview.png'
import landingPageImg from '../../assets/invoice-generator-images/landingPage.png'
import signinSignupImg from '../../assets/invoice-generator-images/signin&signup.png'
import templateTrViewImg from '../../assets/invoice-generator-images/templateTreeview.png'

import footerImg from '../../assets/electromaniac_images/footer.png'
import homePageImg from '../../assets/electromaniac_images/homePage.png'
import homePage2Img from '../../assets/electromaniac_images/homePage2.png'
import scrollSectionImg from '../../assets/electromaniac_images/scrollSection.png'
import scrollSection2Img from '../../assets/electromaniac_images/scrollSection2.png'

const invoiceImages = [
  entitiesImg, 
  entitiesImg2, 
  invoicePDFPreviewImg, 
  invoiceWebPreviewImg, 
  signinSignupImg, 
  templateTrViewImg
];

const electroManiacImages = [
  footerImg,
  homePageImg,
  homePage2Img,
  scrollSectionImg,
  scrollSection2Img
];



export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0); 
  const [time, setTime] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          setScrollX(window.scrollX);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
  let animationFrame;
  let lastTime = Date.now();

  const animate = () => {
    const now = Date.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;
    setTime(prev => prev + deltaTime);
    animationFrame = requestAnimationFrame(animate);
  };

  animationFrame = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(animationFrame);
}, []);

  // Image carousel effect - add this after your other useEffect hooks
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % invoiceImages.length);
      }, 1500);

      return () => clearInterval(interval);
    }, []);

  useEffect(() => {
  const observerOptions = {
    threshold: 0.15 // Section reveals when 15% is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
      }
    });
  }, observerOptions);

  // Target all sections
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('reveal-hidden');
    observer.observe(section);
  });

  return () => observer.disconnect();
  }, []);

  // Generate stars once and reuse them for performance
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      baseX: Math.random() * 100,
      baseY: Math.random() * 100,
      size: Math.random() * 2 + 0.3,
      opacity: Math.random() * 0.7 + 0.1,
      // Ensure speeds are positive for top-left to bottom-right direction
      floatSpeed: Math.random() * 0.2 + 0.05, 
      scrollSensitivity: Math.random() * 0.05 + 0.01
    }));
  }, []);

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Navbar height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const MenuItem = ({ icon, label, href }) => (
    <a href={href} className="icon-link" title={label} target="_blank" rel="noopener noreferrer">
      {icon}
    </a>
  );

  const getStarPosition = (star) => {
    // 1. Idle Movement: Linear diagonal movement based on time
    const idleMovement = time * star.floatSpeed;

    // 2. Scroll Movement: Extra push based on scroll position
    const scrollMovement = scrollY * star.scrollSensitivity;

    // Combine both for a "speeding up" effect during scroll
    const totalOffset = idleMovement + scrollMovement;

    // Calculate X and Y (same offset creates a 45-degree slant)
    // Adding star.baseX/Y ensures they start at different random spots
    const finalX = (star.baseX + totalOffset) % 100;
    const finalY = (star.baseY + totalOffset) % 100;

    return { x: finalX, y: finalY };
  };

  return (
    <div className="portfolio-container">
      {/* Dynamic Falling Stars Background */}
      <div className="background-fixed">
        <svg width="100%" height="100%" className="stars-svg">
          {stars.map((star) => {
            const pos = getStarPosition(star);
            return (
              <circle
                key={star.id}
                cx={`${pos.x}%`}
                cy={`${pos.y}%`}
                r={star.size}
                fill="white"
                fillOpacity={star.opacity}
                style={{
                  transition: 'cx 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94), cy 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo" onClick={() => scrollToSection('home')}>
            <span>THARIQ HUSSAIN</span>
          </div>
          
          <div className="nav-links-desktop">
            {['Home', 'About', 'Stack', 'Projects', 'Contact'].map(item => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {isMenuOpen && (
          <div className="nav-links-mobile">
            {['Home', 'About', 'Stack', 'Projects', 'Contact'].map(item => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="nav-link-mobile"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="section-container">
          <div className="hero-content">
            <h1 className="hero-title">Frontend<br />Developer</h1>
            <p className="hero-subtitle">
              Hi! I'm Thariq Hussain. A Frontend Developer specialized in building high-performance, responsive web solutions with modern technologies.
            </p>
            <div className="hero-buttons">
              <button onClick={() => scrollToSection('projects')} className="btn-primary">View My Work </button>
              <button onClick={() => scrollToSection('contact')} className="btn-secondary">Get in Touch</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stack Section */}
      <section >
        <div id="stack" className="stack-section">
              <div className='tech-section-seperation'>
                <h2>Frontend</h2>
                <div className='tech-skills'>
                  <ul>
                    <li className='img-and-skill'><img src={jsLogo} alt='js-icon' /><span>Javascript</span></li>
                    <li className='img-and-skill'><img src={reactLogo} alt='react-icon' /><span>React</span></li>
                    <li className='img-and-skill'><img src={htmlLogo} alt='html-icon' /><span>HTML</span></li>
                    <li className='img-and-skill'><img src={cssLogo} alt='css-icon' /><span>CSS</span></li>
                    <li className='img-and-skill'><img src={bootstrapLogo} alt='bt-icon' /><span>Bootstrap</span></li>
                  </ul>
                </div>
              </div>
              <div className='tech-section-seperation'>
                <h2>Backend</h2>
                <div className='tech-skills'>
                  <ul>
                    <li className='img-and-skill'><img src={nodejsIcon} alt='node-icon' /><span>Node JS</span></li>
                    <li className='img-and-skill'><img src={mysqlIcon} alt='mysql-icon' /><span>MYSQL</span></li>
                  </ul>
                </div>
              </div>
              <div className='tech-section-seperation'>
                <h2>Tools & AI</h2>
                <div className='tech-skills'>
                  <ul>
                    <li className='img-and-skill'><img src={githubIcon} alt='git-icon' /><span>Git Hub</span></li>
                    <li className='img-and-skill'><img src={postmanIcon} alt='postman-icon' /><span>Postman API</span></li>
                    <li className='img-and-skill'><img src={antiGravityIcon} alt='antigravity-icon' /><span>Anti Gravity</span></li>
                    <li className='img-and-skill'><img src={claudeAIIcon} alt='claude-icon' /><span>Claude AI</span></li>
                    <li className='img-and-skill'><img src={chatgptIcon} alt='chatgpt-icon' /><span>Chat GPT</span></li>
                    <li className='img-and-skill'><img src={geminiIcon} alt='gemini-icon' /><span>Gemini AI</span></li>
                  </ul>
                </div>
              </div>
        </div>    
      </section>

      
      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <div className="section-container">
          <div className="projects-header">
            <h2 className="projects-title">Projects</h2>
          </div>
          
          <div className="projects-grid">
            {[
              {
                title: 'Electromaniac',
                desc: 'A dynamic electronics project showcasing modern React patterns and interactive UI components.',
                tech: ['React', 'JavaScript', 'CSS3'],
                icon: '⚡',
                color: '#3b82f6',
                hasCarousel: false
              },
              {
                title: 'Invoice Generator',
                desc: 'Professional invoice creation tool with customizable templates, real-time preview and PDF export.',
                tech: ['React', 'React-Router', 'Javascript', 'HTML', 'CSS', 'PDF renderer', 'mermaid.js',],
                icon: '📄',
                color: '#10b981',
                hasCarousel: true
              }
            ].map((proj, idx) => (
              <div key={proj.title} className="project-card-modern">
                <div className="project-card-header">
                  <div className="project-icon" style={{ color: proj.color }}>
                    {proj.icon}
                  </div>
                  <h3 className="project-card-title">{proj.title}</h3>
                </div>

                <p className="project-card-desc">{proj.desc}</p>

                {proj.hasCarousel && (
                  <div className="project-preview">
                    <div className="carousel-container">
                      {invoiceImages.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Invoice template ${index + 1}`}
                          className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
                        />
                      ))}
                      <div className="carousel-indicators">
                        {invoiceImages.map((_, index) => (
                          <div
                            key={index}
                            className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="project-tech-stack">
                  {proj.tech.map(t => (
                    <span key={t} className="tech-badge">{t}</span>
                  ))}
                </div>

                <div className="project-footer">
                  <button className="project-btn-view">
                    View Project
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7V17"/>
                    </svg>
                  </button>
                </div>

                <div className="project-card-border"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-container contact-center">
          <h2 className="contact-title">Let's Connect</h2>
          <div className="social-links">
            <MenuItem label="GitHub" href="#" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>} />
            <MenuItem label="LinkedIn" href="#" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.836 0-9.754h3.554v1.391c.432-.668 1.204-1.618 2.928-1.618 2.136 0 3.745 1.395 3.745 4.393v5.588zM5.337 9.433c-1.144 0-1.915-.758-1.915-1.706 0-.968.77-1.707 1.96-1.707 1.188 0 1.914.739 1.939 1.706 0 .948-.751 1.707-1.984 1.707zm1.586 11.019H3.73V9.694h3.193v10.758zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>} />
          </div>
          <div className="contact-box">
            <p className="contact-email">ðŸ“§ <span>thariq.hussain@example.com</span></p>
            <p className="contact-status">Open for freelance and full-time opportunities</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>Â© 2025 Thariq Hussain. Built with React.</p>
      </footer>
    </div>
  );
}