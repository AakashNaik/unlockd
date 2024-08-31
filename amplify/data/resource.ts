import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({

  MCQDB: a.model({
    Question: a.string(),
    OptionA: a.string(),
    OptionB: a.string(),
    OptionC: a.string(),
    OptionD: a.string(),
    Answer: a.string(),
    Explanation: a.string(),
    TopicID: a.string(),
    DifficultyLevel: a.string(),
  }).authorization(allow => [allow.publicApiKey()]),

  SCOREDB: a.model({
    Testtype: a.string(),
    Date: a.datetime(),
    Score: a.float(),
    UserId: a.string(),
    TopicID: a.string(),
    TestID: a.string(),
  }).authorization(allow => [allow.owner().to(['create', 'read', 'update', 'delete'])]),
    
  TOPICDB: a.model({
    TopicID: a.string(),
    Topic: a.string(),
    Section: a.string(),
    Key: a.string(),
  }).authorization(allow => [allow.publicApiKey()]),

  TESTDB: a.model({
    TestID: a.string(),
    UserId: a.string(),
    Easy: a.float(),
    Medium: a.float(),
    Difficult: a.float(),
    Timetaken: a.float(),
    TopicID: a.string(),
    // ... other fields ...
  }).authorization(allow => [allow.owner().to(['create', 'read', 'update', 'delete'])]),

  TESTQUESTIONDB: a.model({
    ID: a.string(),
    TestID: a.string(),
    QuestionID: a.string(),
    UserID: a.string(),
  }).authorization(allow => [allow.owner().to(['create', 'read', 'update', 'delete'])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
