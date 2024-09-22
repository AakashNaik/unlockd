import React, { useState, useEffect, useRef } from 'react';
import { Box, Drawer, Typography, Tab, Tabs, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SelectChangeEvent } from '@mui/material/Select';
import { fetchAuthSession } from 'aws-amplify/auth';
import { parseISO, format } from 'date-fns';
import styles from '../ScorePage.module.css';

interface ScoreData {
  id: string;
  UserId: string;
  Date: string;
  Score: number;
  TestID: string;
  Testtype: string;
  TopicID: string | null;
  createdAt: string;
  updatedAt: string;
}


export function ScorePage() {
  const [mixScoreData, setMixScoreData] = useState<ScoreData[]>([]);
  const [topicScoreData, setTopicScoreData] = useState<ScoreData[]>([]);
  const [activeTab, setActiveTab] = useState<'mix' | 'topic'>('mix');
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    const fetchAllMarks = async () => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;

      setIsLoading(true);
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      try {
        const fetchData = async (testType: 'mix' | 'single') => {
          const params = new URLSearchParams({ Testtype: testType });
          const response = await fetch(`https://euzz40iy52.execute-api.ap-south-1.amazonaws.com/dev/?${params.toString()}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            }
          });
          console.log("response", response);
          return await response.json();
        };

        const [mixData, topicData] = await Promise.all([
          fetchData('mix'),
          fetchData('single')
        ]);

        const formatData = (data: any[]): ScoreData[] => data.map(item => ({
          id: item.id,
          UserId: item.UserId,
          Date: item.Date,
          Score: item.Score,
          TestID: item.TestID,
          Testtype: item.Testtype,
          TopicID: item.TopicID,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));

        const formattedMixData = formatData(mixData);
        const formattedTopicData = formatData(topicData);

        setMixScoreData(formattedMixData);
        setTopicScoreData(formattedTopicData);

        const uniqueTopics = Array.from(new Set(formattedTopicData.map(test => test.TopicID).filter((topic): topic is string => topic !== null)));
        setTopics(['All', ...uniqueTopics]);

      } catch (error) {
        console.error('Error fetching score data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMarks();
  }, []);

  const handleTabChange = (_ : React.SyntheticEvent, newValue: 'mix' | 'topic') => {
    setActiveTab(newValue);
    setSelectedTopic('All');
  };

  const handleTopicChange = (event: SelectChangeEvent<string>) => {
    setSelectedTopic(event.target.value);
  };

  const currentScoreData = activeTab === 'mix' ? mixScoreData : topicScoreData;
  const filteredData = selectedTopic === 'All' ? currentScoreData : currentScoreData.filter(test => test.TopicID === selectedTopic);

  const sortedData = filteredData
    .map(item => ({
      ...item,
      Date: format(parseISO(item.Date), 'yyyy-MM-dd')
    }))
    .sort((a, b) => parseISO(a.Date).getTime() - parseISO(b.Date).getTime());

  const columns: GridColDef[] = [
    { field: 'Date', headerName: 'Date', width: 120 },
    { field: 'Score', headerName: 'Score', width: 100 },
    ...(activeTab === 'topic' ? [{ field: 'topic', headerName: 'Topic', width: 150 }] : []),
  ];

  return (
    <Box className={styles.container}>
      <Drawer
        variant="permanent"
        className={styles.drawer}
        classes={{
          paper: styles.drawerPaper,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          orientation="vertical"
          variant="scrollable"
          className={styles.tabs}
        >
          <Tab label="Mix Test" value="mix" />
          <Tab label="Topic Test" value="topic" />
        </Tabs>
      </Drawer>
      <Box component="main" className={styles.main}>
        <Typography variant="h4" gutterBottom>
          {activeTab === 'mix' ? 'Mix Test Scores' : 'Topic Test Scores'}
        </Typography>
        {activeTab === 'topic' && (
          <FormControl className={styles.formControl}>
            <InputLabel id="topic-select-label">Topic</InputLabel>
            <Select
              labelId="topic-select-label"
              value={selectedTopic}
              onChange={handleTopicChange}
            >
              {topics.map((topic) => (
                <MenuItem key={topic} value={topic}>{topic}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            <Box className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={sortedData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="Date" 
                    tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip labelFormatter={(value) => format(parseISO(value), 'MMM dd, yyyy')} />
                  <Legend />
                  <Line type="monotone" dataKey="Score" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            <Box className={styles.gridContainer}>
              <DataGrid
                rows={filteredData}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 5, page: 0 },
                  },
                }}
                pageSizeOptions={[5, 10, 25]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
