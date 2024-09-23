import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Flex } from "@aws-amplify/ui-react";
//import backgroundImage from "../assets/home_image.jpg";
import mountain from "../assets/mountain.png";
import GlassmorphismComponent from "./Glass";
import { Speedometer } from "./Speedometer";
import Cube from "./RotatingBox";
import GlassLightComponent from "./GlassLight";
import '../HomePage.css';
//import Ladder from './Step';
import stairs from "/stairs.svg";
import customStairsSvg from "/Section 7.svg";
//import SuccessAnimation from './SuccessAnimation';
import EqualIcon from '@mui/icons-material/DragHandle';
import AddIcon from '@mui/icons-material/Add';
import styles from '../Homepage.module.css';  // Add this import

export function HomePage() {
  const [highlightedCard, setHighlightedCard] = useState<string | null>(null);

  useEffect(() => {
    const sequence = ['personalized', 'adaptive', 'learning'];
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      setHighlightedCard(sequence[currentIndex]);
      currentIndex = (currentIndex + 1) % sequence.length;
    }, 1800); // 1.8 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section" style={{ }}>
        <Flex className="nav-container">
          <nav>
            <Flex justifyContent="flex-end">
              <Button 
                className="nav-button-transparent" 
                style={{ background: 'none', border: 'none', boxShadow: 'none' }}
              >
                <Link to={"/"} className="nav-link" style={{ color: 'black' }}>Home</Link>
              </Button>
              <Button 
                className="nav-button-black" 
                style={{ backgroundColor: 'black', border: '1px solid black', boxShadow: 'none' }}
              >
                <Link to={"/test"} className="nav-link" style={{ color: 'white' }}>Take Test</Link>
              </Button>
              <Button 
                className="nav-button-transparent" 
                style={{ background: 'none', boxShadow: 'none' }}
              >
                <Link to={"/myscore"} className="nav-link" style={{ color: 'black' }}>My Score</Link>
              </Button>
            </Flex>
          </nav>
        </Flex>
        <Flex direction='column' justifyContent='center' className="hero-content" margin={120}>
          <h1 className='main-page-heading' style={{ 
            fontWeight: 'bold', 
            fontSize: '2.5rem', 
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            marginBottom: '1rem'
          }}>
            Improve your score without extra effort
          </h1>
          <div className="hero-text-container">
            <p style={{ 
              fontWeight: '600', 
              fontSize: '1.2rem', 
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              letterSpacing: '0.5px'
            }}>
              Your AI companion to get the best score in the least amount of time
            </p>
          </div>
        </Flex>
      </div>
      <div className={styles.cubeSection}>
        <h3 className={styles.sectionHeadingWhite}>Score depends on studying and planning</h3>
        <Flex alignItems="center" justifyContent="center" style={{ gap: '20px' }}>
          <Cube text="Score" customStyle={{ width: '400px', height: '400px' }}/>
          <EqualIcon 
            sx={{ 
              fontSize: 40, 
              fontWeight: 'bold', 
              color: '#ffffff', // Adjust color as needed
            }} 
          />
          <Cube text="Studying"  customStyle={{ width: '400px', height: '400px' }}/>
          <AddIcon 
            sx={{ 
              fontSize: 40, 
              fontWeight: 'bold', 
              
              color: '#ffffff', // Adjust color as needed
            }} 
          />
          <Cube text="Planning"  customStyle={{ width: '400px', height: '400px' }}/>
        </Flex>
      </div>
      <div className="mountain-section" style={{ backgroundImage: `url(${mountain})` }}>
        <div className="mountain-overlay"></div>
        <div className="mountain-content">
          <h3 className={styles.sectionHeadingBlack}>Challenges in Planning</h3>
          <div className="mountain-cards">
            <GlassLightComponent text="Difficult to establish strength & weakness without data" width="80%" height="100%" />
            <GlassLightComponent text="Planning is complex and time-consuming" width="80%" height="100%" />
            <GlassLightComponent text="Difficult to set realistic time for each chapter and concept" width="80%" height="100%" />
            <GlassLightComponent text="Missing one session means replanning everything" width="80%" height="100%" />
          </div>
        </div>
      </div>
      <div className={styles.bottomSection}>
        <GlassmorphismComponent 
          text="Adaptive Test" 
          className={highlightedCard === 'adaptive' ? styles.highlighted : ''}
        />
        <div className={styles.bottomRow}>
          <GlassmorphismComponent 
            text="Personalized Assessment" 
            className={highlightedCard === 'personalized' ? styles.highlighted : ''}
          />
          <Speedometer />
          <GlassmorphismComponent 
            text="Learning Track" 
            className={highlightedCard === 'learning' ? styles.highlighted : ''}
          />
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
             // Add this to see the image boundaries
                // Add this to see the image area
          }}
        />
      </div>
      {/*<div style={{ height: '400px', width: '100%' }}>
        <SuccessAnimation />
      </div>*/}
    </div>
  );
}

export default HomePage;