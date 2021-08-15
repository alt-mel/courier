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
    ): Delivery!

    updateDelivery(
      id: ID!
      title: String!
      price: String!
      pickup_location: String!
      destination_location: String!
    ): Delivery!

    deleteDelivery(id: ID!): Boolean!

    addUserToDelivery(deliveryId: ID!, userId: ID!): Delivery

    addItemToDelivery(deliveryId: ID!, itemId: ID!): Delivery

    createItem(
      description: String!
      size: String!
      weight: String
      deliveryId: ID!
    ): Item!

    updateItem(
      id: ID!
      description: String!
      size: String!
      weight: String!
    ): Item!

    deleteItem(id: ID!): Boolean!
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
    user: User
    items: [Item]
  }

  type Item {
    id: ID!
    description: String!
    size: String!
    weight: String!
    delivery: Delivery!
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
      { title, price, pickup_location, destination_location },
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
        userId: user._id,
        itemId: [item._id],
      };
      const result = await db.collection('Delivery').insert(newDelivery);
      return result.ops[0];
    },

    updateDelivery: async (
      _,
      { id, title, price, pickup_location, destination_location },
      { db, user }
    ) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      const result = await db.collection('Delivery').updateOne(
        {
          _id: ObjectID(id),
        },
        {
          $set: {
            title,
            price,
            pickup_location,
            destination_location,
            userId,
            itemIds,
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

    addItemToDelivery: async (_, { deliveryId, itemId }, { db, user }) => {
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
        delivery.itemIds.find((dbId) => dbId.toString() === userId.toString())
      ) {
        return delivery;
      }
      await db.collection('Delivery').updateOne(
        {
          _id: ObjectID(deliveryId),
        },
        {
          $push: {
            itemIds: ObjectID(itemId),
          },
        }
      );
      delivery.itemIds.push(ObjectID(itemId));
      return delivery;
    },

    deleteDelivery: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      await db.collection('Delivery').removeOne({ _id: ObjectID(id) });

      return true;
    },

    createItem: async (
      _,
      { description, size, weight, deliveryId },
      { db, user }
    ) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }
      const newItem = {
        description,
        size,
        weight,
        deliveryId: ObjectID(deliveryId),
      };
      const result = await db.collection('Item').insert(newItem);
      return result.ops[0];
    },

    updateItem: async (_, data, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      const result = await db.collection('Item').updateOne(
        {
          _id: ObjectID(data.id),
        },
        {
          $set: data,
        }
      );

      return await db.collection('Item').findOne({ _id: ObjectID(data.id) });
    },

    deleteItem: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication Error. Please sign in');
      }

      await db.collection('Item').removeOne({ _id: ObjectID(id) });

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
    items: async ({ _id }, _, { db }) =>
      await db
        .collection('Item')
        .find({ deliveryId: ObjectID(_id) })
        .toArray(),
  },

  Item: {
    id: ({ _id, id }) => _id || id,
    delivery: async ({ deliveryId }, _, { db }) =>
      await db.collection('Delivery').findOne({ _id: ObjectID(deliveryId) }),
  },
};

const start = async () => {
  const client = new MongoClient(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
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
