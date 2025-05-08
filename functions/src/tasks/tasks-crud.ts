import * as functions from 'firebase-functions';
import { db } from '../init';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

export const tasksCrudApp = express();

tasksCrudApp.use(bodyParser.json());
tasksCrudApp.use(cors({
    origin: ['http://localhost:4200', 'https://fir-tasks-app.web.app'],
}));


tasksCrudApp.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const snap = await db.collection(`users/${userId}/tasks`).orderBy('createdAt').get();
        let tasks: any[] = [];

        if (!snap.empty) {
            snap.forEach(doc => {
                tasks = [
                    {
                        id: doc.id,
                        ...doc.data()
                    },
                    ...tasks
                ]
            })
        }

        functions.logger.debug(tasks)

        res.status(200).json({
            message: '',
            data: tasks
        })
    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
})

tasksCrudApp.post('/:userId/add', async (req, res) => {
    try {
        const { title, description = '' } = req.body;
        const { userId } = req.params;

        if (!title || !userId) {
            return res.status(400).json({
                message: 'Invalid body'
            })
        }

        const payload = {
            title,
            description,
            createdAt: Date.now(),
            completed: false
        }

        const taskRef = await db.collection(`users/${userId}/tasks`).add(payload);

        res.status(200).json({
            message: 'Task created successfully',
            data: {
                id: taskRef.id,
                ...payload
            }
        });
    } catch (err) {
        functions.logger.error(err)

        res.status(500).json({
            message: err
        })
    }
})

tasksCrudApp.put('/:userId/edit/:taskId', async (req, res) => {
    try {
        const task = req.body;
        const { userId, taskId } = req.params;

        if (!taskId || !task.title || !userId) {
            return res.status(400).json({
                message: 'Invalid body'
            })
        }

        const taskRef = db.collection(`users/${userId}/tasks`).doc(taskId);

        await taskRef.update({
            title: task.title,
            description: task.description || '',
            completed: task.completed || false
        });

        res.status(200).json({
            message: 'Task updated successfully',
            data: {
                id: taskId,
                ...task
            }
        });

    } catch (err) {
        functions.logger.error(err);
        res.status(500).json({
            message: err
        })
    }
})

tasksCrudApp.delete('/:userId/delete/:taskId', async (req, res) => {
    try {
        const { userId, taskId } = req.params;

        if (!userId || !taskId) {
            return res.status(400).json({
                message: 'Invalid body'
            })
        }

        await db.collection(`users/${userId}/tasks`).doc(taskId).delete();

        res.status(200).json({
            message: 'Task deleted sucessfully',
            data: {
                id: taskId
            }
        })

    } catch (err) {
        functions.logger.error(err);
        res.status(500).json({
            messsage: err
        })
    }
})