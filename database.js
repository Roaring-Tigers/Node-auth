
import mongoose from 'mongoose';


// Connect to MongoDB
// mongoose.connect("mongodb+srv://auth:XVu1oUqPnO3MtnpV@auth.xharja3.mongodb.net/")
// .then(()=> console.log("MongoDB connected"))
// .catch(err => console.log("MongoDB connection error: ", err));


// connect mongodn with local: 
mongoose.connect("mongodb://localhost:27017/auth-go")
.then(()=> console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error: ", err));