import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Chip } from '@mui/material';

interface QuestionStatus {
  id: number;
  status: 'attempted' | 'notAttempted' | 'underReview';
}

interface QuestionDrawerProps {
  questions: QuestionStatus[];
  onQuestionSelect?: (index: number) => void;
  open: boolean;
  onClose: () => void;
}

const QuestionDrawer: React.FC<QuestionDrawerProps> = ({ questions, onQuestionSelect, open, onClose }) => {
  const getChipColor = (status: string) => {
    switch (status) {
      case 'attempted':
        return '#CDEDA3';
      case 'underReview':
        return '#F8E287';
      default:
        return '#F9DEDC';
    }
  };

  const getChipLabel = (status: string) => {
    switch (status) {
      case 'attempted':
        return 'Attempted';
      case 'underReview':
        return 'Review';
      default:
        return 'Not Attempted';
    }
  };

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <List>
        {questions.map((question, index) => (
          <ListItem key={question.id} disablePadding>
            <ListItemButton 
              onClick={() => {
                onQuestionSelect && onQuestionSelect(index);
                onClose();
              }}
            >
              <ListItemText primary={`Question ${question.id}`} />
              <Chip
                label={getChipLabel(question.status)}
                variant="outlined"
                size="small"
                sx={{ backgroundColor: getChipColor(question.status) }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default QuestionDrawer;