import * as functions from 'firebase-functions';
import { db } from '../init';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import { Task } from '../interfaces/task.interface';

export const tasksCrudApp = express();

tasksCrudApp.use(bodyParser.json());
tasksCrudApp.use(cors({
    origin: ['http://localhost:4200', 'https://fir-tasks-app.web.app'],
}));


tasksCrudApp.get('/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const snap = await db.collection(`users/${userId}/tasks`).orderBy('createdAt').get();
        let tasks: Task[] = [];

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

        return res.status(200).json({
            message: '',
            data: tasks
        })
    } catch (err) {
        functions.logger.error("Error getting user tasks information", err);
        return res.status(500).json({
            error: err,
            message: 'Error getting user tasks information'
        })
    }
})

tasksCrudApp.post('/:userId/add', async (req: Request, res: Response) => {
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

        return res.status(200).json({
            message: 'Task created successfully',
            data: {
                id: taskRef.id,
                ...payload
            }
        });
    } catch (err) {
        functions.logger.error("Error creating task", err);
        return res.status(500).json({
            message: 'Error creating task',
            error: err
        })
    }
})

tasksCrudApp.put('/:userId/edit/:taskId', async (req: Request, res: Response) => {
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

        return res.status(200).json({
            message: 'Task updated successfully',
            data: {
                id: taskId
            }
        });

    } catch (err) {
        functions.logger.error('Error updating task', err);
        return res.status(500).json({
            message: 'Error updating task',
            error: err
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

        return res.status(200).json({
            message: 'Task deleted sucessfully',
            data: {
                id: taskId
            }
        })

    } catch (err) {
        functions.logger.error('Error deleting task', err);
        return res.status(500).json({
            messsage: 'Error deleting task',
            error: err
        })
    }
})