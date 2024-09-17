/*
import React, { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { decodeJWT } from 'aws-amplify/auth';

import axios from 'axios';

const JWTToken = () => {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the current authenticated user's session
        const session = await fetchAuthSession();

      
        
        // Get the ID token (contains the `sub` and other user details)
        const idToken = session.tokens?.idToken?.toString() ;
        
        console.log("id token", idToken);
        //const decodedToken = decodeJWT(idToken);
        //console.log("decoded token", decodedToken);
        // Prepare the body content for the POST request
        const test_type = 'example_test_type123';
        const score = 100; // Example score
        const topic_id = 'some-topic-id';
        const test_id = 'some-test-id';
        
        const requestBody = {
         
          'Testtype': test_type,
          'Score': score,
          'TopicID': topic_id,
          'TestID': test_id,
          
        };

        // Call the API Gateway endpoint with the token and POST the data
        const response = await axios.post('https://euzz40iy52.execute-api.ap-south-1.amazonaws.com/dev/', requestBody, {
          headers: {
            Authorization: `Bearer ${idToken}`,  // Pass the JWT token
          },
        });
        
        // Set the student data received from the backend or log the success
        setStudentData(response.data);
        console.log('Data successfully sent:', response.data);

      } catch (error) {
        console.error("Error posting student data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {studentData ? (
        <div>{/* Render student data here */
