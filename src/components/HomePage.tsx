import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Flex } from "@aws-amplify/ui-react";
import backgroundImage from "../assets/home_image.jpg";
import mountain from "../assets/mountain.png";
import GlassmorphismComponent from "./Glass";
import { Speedometer } from "./Speedometer";
import Cube from "./RotatingBox";
import GlassLightComponent from "./GlassLight";
import '../HomePage.css';
import Ladder from './Step';
import stairs from "/stairs.svg";
import customStairsSvg from "/Section 7.svg";
import SuccessAnimation from './SuccessAnimation';

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <div className="hero-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <Flex className="nav-container">
          <nav>
            <Flex justifyContent="flex-end">
              <Button className="nav-button">
                <Link to={"/"} className="nav-link nav-link-black">Home</Link>
              </Button>
              <Button className="nav-button-black">
                <Link to={"/test"} className="nav-link nav-link-white">Take Test</Link>
              </Button>
              <Button className="nav-button-transparent">
                <Link to={"/myscore"} className="nav-link">My Score</Link>
              </Button>
            </Flex>
          </nav>
        </Flex>
        <Flex direction='column' justifyContent='center' className="hero-content">
          <h1 className='main-page-heading' style={{ 
            fontWeight: 'bold', 
            fontSize: '2.5rem', 
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            marginBottom: '1rem'
          }}>
            Unleash Your Potential
          </h1>
          <div className="hero-text-container">
            <p style={{ 
              fontWeight: '600', 
              fontSize: '1.2rem', 
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              letterSpacing: '0.5px'
            }}>
              Your AI Companion to Boost Your Score in Record Time
            </p>
          </div>
        </Flex>
      </div>
      <div className="cube-section">
        <Cube text="Score"/>
        <Cube text="Studying"/>
        <Cube text="Planning"/>
        
      </div>
      <div className="mountain-section" style={{ backgroundImage: `url(${mountain})` }}>
        <div className="mountain-overlay"></div>
        <div className="mountain-content">
          <div className="mountain-cards">
            <GlassLightComponent text="Card 1" width="80%" height="100%" />
            <GlassLightComponent text="Card 2" width="80%" height="100%" />
            <GlassLightComponent text="Card 3" width="80%" height="100%" />
            <GlassLightComponent text="Card 4" width="80%" height="100%" />
          </div>
        </div>
      </div>
      <div className="bottom-section">
        <GlassmorphismComponent text="Adaptive Test" />
        <div className="bottom-row">
          <GlassmorphismComponent text="Personalized Assessment" />
          <Speedometer />
          <GlassmorphismComponent text="Learning Track" />
        </div>
      </div>
      <div className="stairs-section" style={{
        backgroundColor: '#F5F5F7',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '600px',
        overflow: 'hidden'
      }}>
        <img 
          src={customStairsSvg} 
          alt="Custom Stairs" 
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      </div>
      <div className="custom-stairs-section" style={{
        backgroundColor: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '600px',
        overflow: 'hidden'
      }}>
        <img 
          src={stairs} 
          alt="Custom Stairs" 
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%', 
            objectFit: 'contain',
            border: '1px solid red', // Add this to see the image boundaries
            background: '#f0f0f0'    // Add this to see the image area
          }}
        />
      </div>
      <div style={{ height: '400px', width: '100%' }}>
        <SuccessAnimation />
      </div>
    </div>
  );
};

export default HomePage;