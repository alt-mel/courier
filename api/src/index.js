const { ApolloServer, gql } = require('apollo-server');
const { MongoClient, ObjectID } = require('mongodb');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv.config();

const { DB_URI, JWT_SECRET } = process.env;

const getToken = (user) =>
  jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30 days' });

const getUserFromToken = async (token, db) => {
  if (!token) {
    return null;
  }

  const tokenData = jwt.verify(token, 'asdfghjkjhgfdsdfghjklkjhgfd');
  
  if (!tokenData?.id) {
    return null;
  }
  return await db.collection('Users').findOne({ _id: ObjectID(tokenData.id) });
};

const typeDefs = gql`
  type Query {
    myDeliveries: [Delivery!]!
    getPredictions(description: String!): [Prediction!]!
    getDelivery(id: ID!): Delivery
  }

  type Mutation {
    signUp(input: SignUpInput!): AuthUser!
    signIn(input: SignInInput!): AuthUser!

    createDelivery(
      title: String!
      price: String!
      pickup_location: String!
      destination_location: String!
      description: String!
      size: String!
      weight: String!
      status: String!
    ): Delivery!

    createPrediction(
      description: String!
    ): Prediction!

    updateDelivery(
      id: ID!
      title: String!
      price: String!
      pickup_location: String!
      destination_location: String!
      description: String!
      size: String!
      weight: String!
      status: String!
    ): Delivery!

    deleteDelivery(id: ID!): Boolean!
    deletePrediction(id: ID!): Boolean!


    addUserToDelivery(deliveryId: ID!, userId: ID!): Delivery
  }

  input SignUpInput {
    email: String!
    password: String!
    name: String!
    avatar: String
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type AuthUser {
    user: User!
    token: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }

  type Delivery {
    id: ID!
    title: String!
    price: String!
    pickup_location: String!
    destination_location: String!
    description: String!
    size: String!
    weight: String!
    status: String!
    user: User  
  }

  type Prediction {
    id: ID!
    description: String!
  }
`;

const resolvers = {
  Query: {
    myDeliveries: async (_, __, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }
      return await db.collection('Delivery').find().toArray();
    },

    getDelivery: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }
      return await db.collection('Delivery').findOne({ _id: ObjectID(id) });
    },

    getPredictions:  async (_, { description }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }
      console.log("In get predictions")
      const regex = new RegExp(description, 'i');
     return await db.collection('Prediction').find({ description:{$regex: regex} }).toArray();
    }, 
  },
  Mutation: {
    signUp: async (_, { input }, { db }) => {
      const hashedPassword = bcrypt.hashSync(input.password);
      const newUser = {
        ...input,
        password: hashedPassword,
      };
      const result = await db.collection('Users').insert(newUser);
      const user = result.ops[0];
      return {
        user,
        token: getToken(user),
      };
    },

    signIn: async (_, { input }, { db }) => {
      const user = await db.collection('Users').findOne({ email: input.email });
      const isPasswordCorrect =
        user && bcrypt.compareSync(input.password, user.password);

      if (!user || !isPasswordCorrect) {
        throw new Error('Invalid credentials!');
      }

      return {
        user,
        token: getToken(user),
      };
    },

    createDelivery: async (
      _,
      { title, price, pickup_location, destination_location, description, size, weight },
      { db, user }
    ) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      const newDelivery = {
        title,
        price,
        pickup_location,
        destination_location,
        description,
        size,
        weight,
        status: "waiting",
        userId: user._id,
      };
      const result = await db.collection('Delivery').insert(newDelivery);
      return result.ops[0];
    },

    createPrediction: async (
      _,
      {  description },
      { db, user }
    ) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      const newPrediction = {
        description
      };
      const result = await db.collection('Prediction').insert(newPrediction);
      return result.ops[0];
    },

    updateDelivery: async (
      _,
      { id, title, price, pickup_location, destination_location, description, size, weight, status },
      { db, user }
    ) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      await db.collection('Delivery').updateOne(
        {
          _id: ObjectID(id),
        },
        {
          $set: {
            title,
            price,
            pickup_location,
            destination_location,
            description,
            size,
            weight,
            status,
            userId
                    },
        }
      );

      return await db.collection('Delivery').findOne({ _id: ObjectID(id) });
    },

    addUserToDelivery: async (_, { deliveryId, userId }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      const delivery = await db
        .collection('Delivery')
        .findOne({ _id: ObjectID(deliveryId) });
      if (!delivery) {
        return null;
      }
      if (
        delivery.userId.find((dbId) => dbId.toString() === userId.toString())
      ) {
        return delivery;
      }
      await db.collection('Delivery').updateOne(
        {
          _id: ObjectID(deliveryId),
        },
        {
          userId: ObjectID(userId),
        }
      );
      delivery.userId = ObjectID(userId);
      return delivery;
    },

    deleteDelivery: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      await db.collection('Delivery').removeOne({ _id: ObjectID(id) });

      return true;
    },

    deletePrediction: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      await db.collection('Prediction').removeOne({ _id: ObjectID(id) });

      return true;
    },
  },

  User: {
    id: ({ _id, id }) => _id || id,
  },

  Delivery: {
    id: ({ _id, id }) => _id || id,
    user: async ({ userId }, _, { db }) =>
      await db.collection('User').findOne({ _id: ObjectID(userId) }),
  },

  Prediction: {
    id: ({ _id, id }) => _id || id,
  },
};

const start = async () => {

  const client = new MongoClient(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
    try {

  await client.connect();
    } catch (err) {
      console.error(`Error connecting to database: ${err}`)
  }
  
  const db = client.db('courier');

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const user = await getUserFromToken(req.headers.authorization, db);
      return {
        db,
        user,
      };
    },
  });

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

start();
