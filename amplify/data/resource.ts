import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// type Medication = {
// 	name: string,
// 	quantity: number,
// 	unit: string,
// 	period: number,
// 	times: Map<number, Array<Time>>,
// 	notes: string,
// };

const schema = a.schema({
  user: a.model({
    medications: a.hasMany('medication', 'userId'),
  }).authorization((allow) => [allow.authenticated()]),
  medication: a.model({
    userId: a.id(),
    user: a.belongsTo('user', 'userId'),
    name: a.string().required(),
    quantity: a.integer().required(),
    unit: a.string(),
    period: a.integer().required(),
    times: a.json().required(), // Using JSON to store Map<number, Array<Time>>
    notes: a.string(),
  }).authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
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
