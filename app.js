
// const express = require('express');
// const mongoose = require('mongoose');
import express from 'express'; 

import "./database.js";

import User from './models/User.js';

import authRouter from './routes/User.js';


const app = express(); 
const PORT = 5000;


app.use(express.json()); // for parsing json

app.use("/api/auth/" , authRouter);





app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));