import mongoose from "mongoose";

// ============ OLD CODE - COMMENTED OUT ============
// let isConnected: boolean = false;
// export const connectToDB = async (): Promise<void> => {
//   mongoose.set("strictQuery", true)
//   if (isConnected) {
//     console.log("MongoDB is already connected");
//     return;
//   }
//   try {
//     await mongoose.connect(process.env.MONGODB_URL || "", {
//       dbName: "Borcelle_Admin"
//     })
//     isConnected = true;
//     console.log("MongoDB is connected");
//   } catch (err) {
//     console.log(err)
//   }
// }
// ============ END OLD CODE ============

// ============ NEW CODE ============
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDB = async (): Promise<typeof mongoose> => {
  mongoose.set("strictQuery", true);
  
  if (cached.conn) {
    console.log("MongoDB is already connected");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: "Borcelle_Admin",
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,  // 30 seconds timeout
      socketTimeoutMS: 45000,            // 45 seconds socket timeout
      maxPoolSize: 10,                   // Connection pool size
      minPoolSize: 2,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URL || "", opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB is connected");
  } catch (err) {
    cached.promise = null;
    console.error("MongoDB connection error:", err);
    throw err;
  }

  return cached.conn;
};
// ============ END NEW CODE ============
