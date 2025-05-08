import * as functions from 'firebase-functions';
import { db } from '../init';
import { ApiResponse, ErrorResponse } from '../interfaces/api-response.interface'
import { User } from '../interfaces/user.interface'
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

export const userAuthApp = express();

userAuthApp.use(bodyParser.json());
userAuthApp.use(cors({
    origin: ['http://localhost:4200', 'https://fir-tasks-app.web.app'],
}));

userAuthApp.get('/userExists', async (req, res) => {
    try {
        const { email } = req.query;

        const docRef = await db.collection('users').where('email', '==', email).get();

        if(docRef.empty) {
            const errorResponse: ErrorResponse = {
                message: 'User not found',
                error: null
            }

            return res.status(404).json(errorResponse)
        }

        const snap = docRef.docs[0];

        const userData: User = {
            id: snap.id,
            ...snap.data(),
        };

        const successResponse: ApiResponse<User> = {
            message: 'User exists',
            data: userData
        }

        res.status(200).json(successResponse)
    } catch (err) {
        functions.logger.error("Error getting user information", err);
        res.status(500).json({
            message: 'Error getting user information'
        })
    }
});

userAuthApp.post('/register', async (req, res) => {
    try {
        const { email } = req.body;

        const docRef = await db.collection('users').where('email', '==', email).get();

        if(!docRef.empty) {
            return res.status(403).json({
                message: 'User already exists',
            })
        }

        const payload = {
            email,
            createdAt: Date.now(),
        }

        const add = await db.collection('users').add(payload);

        res.status(200).json({
            message: 'User registered successfully ' + email,
            data: {
                id: add.id,
                ...payload
            }
        })
    } catch (err) {
        functions.logger.error("Error registering user", err);
        res.status(500).json({
            message: 'Error registering user'
        })
    }
})