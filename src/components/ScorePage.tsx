import React, { useState, useEffect } from 'react';
import { Box, Drawer, Typography, Tab, Tabs, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SelectChangeEvent } from '@mui/material/Select';

interface ScoreData {
  id: string;
  userId: string;
  date: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  topic?: string;
}

const drawerWidth = 240;

export function ScorePage() {
  const [scoreData, setScoreData] = useState<ScoreData[]>([]);
  const [activeTab, setActiveTab] = useState<'mix' | 'topic'>('mix');
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  useEffect(() => {
    fetch('/sampleScoreData.json')
      .then(response => response.json())
      .then(data => {
        const currentData = activeTab === 'mix' ? data.mixTests : data.topicTests;
        setScoreData(currentData);
        if (activeTab === 'topic') {
          const uniqueTopics = Array.from(new Set(data.topicTests.map((test: ScoreData) => test.topic ?? '')));
          setTopics(['All', ...uniqueTopics.filter((topic): topic is string => typeof topic === 'string')]);
        }
      });
  }, [activeTab]);

  const handleTabChange = (_ : React.SyntheticEvent, newValue: 'mix' | 'topic') => {
    setActiveTab(newValue);
    setSelectedTopic('All');
  };

  const handleTopicChange = (event: SelectChangeEvent<string>) => {
    setSelectedTopic(event.target.value);
  };

  const filteredData = selectedTopic === 'All' ? scoreData : scoreData.filter(test => test.topic === selectedTopic);

  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'score', headerName: 'Score', width: 100 },
    { field: 'correctAnswers', headerName: 'Correct', width: 100 },
    { field: 'wrongAnswers', headerName: 'Wrong', width: 100 },
    ...(activeTab === 'topic' ? [{ field: 'topic', headerName: 'Topic', width: 150 }] : []),
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          orientation="vertical"
          variant="scrollable"
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          <Tab label="Mix Test" value="mix" />
          <Tab label="Topic Test" value="topic" />
        </Tabs>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {activeTab === 'mix' ? 'Mix Test Scores' : 'Topic Test Scores'}
        </Typography>
        {activeTab === 'topic' && (
          <FormControl sx={{ m: 1, minWidth: 120 }}>
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
        <Box sx={{ height: 400, mb: 4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
        <Box sx={{ height: 400, width: '100%' }}>
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
      </Box>
    </Box>
  );
}
