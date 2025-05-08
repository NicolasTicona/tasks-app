import * as functions from 'firebase-functions';
import { db } from '../init';
import { User } from '../interfaces/user.interface'
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';

export const userAuthApp = express();

userAuthApp.use(bodyParser.json());
userAuthApp.use(cors({
    origin: ['http://localhost:4200', 'https://fir-tasks-app.web.app'],
}));

userAuthApp.get('/userExists', async (req: Request, res: Response) => {
    try {
        const { email } = req.query;

        const docRef = await db.collection('users').where('email', '==', email).get();

        if (docRef.empty) {
            return res.status(404).json({
                message: 'User not found',
                error: null
            })
        }

        const snap = docRef.docs[0];

        const userData: User = {
            id: snap.id,
            ...snap.data(),
        };

        return res.status(200).json({
            message: 'User exists',
            data: userData
        })
    } catch (err) {
        functions.logger.error("Error getting user information", err);
        return res.status(500).json({
            message: 'Error getting user information',
            error: err
        })
    }
});

userAuthApp.post('/register', async (req, res) => {
    try {
        const { email } = req.body;

        const docRef = await db.collection('users').where('email', '==', email).get();

        if (!docRef.empty) {
            return res.status(403).json({
                message: 'User already exists',
                error: null
            })
        }

        const payload = {
            email,
            createdAt: Date.now(),
        }

        const snap = await db.collection('users').add(payload);

        return res.status(200).json({
            message: 'User registered successfully ' + email,
            data: {
                id: snap.id,
                ...payload
            }
        })
    } catch (err) {
        functions.logger.error("Error registering user", err);
        return res.status(500).json({
            message: 'Error registering user',
            error: err,
        })
    }
})