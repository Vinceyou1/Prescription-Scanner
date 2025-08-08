import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// type Medication = {
// 	name: string,
// 	quantity: number,
// 	unit: string,
// 	period: number,
// 	times: Map<number, Array<Time>>,
// 	notes: string,
// };

const schema = a.schema({
  user: a
    .model({
      medications: a.hasMany("medication", "userId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  medication: a
    .model({
      userId: a.id(),
      user: a.belongsTo("user", "userId"),
      name: a.string().required(),
      quantity: a.integer().required(),
      unit: a.string(),
      period: a.integer().required(),
      times: a.json().required(), // Using JSON to store Map<number, Array<Time>>
      notes: a.string(),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});