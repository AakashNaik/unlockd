import { type Schema } from '../resource';

export const handler: Schema['filterQuestions']['functionHandler'] = async (event, context: any) => {
  const { testType, topicId } = event.arguments;
  
  // Use the DataStore API to query the MCQDB
  const filteredQuestions = await context.data.MCQDB.scan({
    filter: {
      and: [
        { DifficultyLevel: { eq: testType } },
        { TopicID: { eq: topicId } }
      ]
    }
  });

  // Adjust the return structure
  return filteredQuestions || null;
};