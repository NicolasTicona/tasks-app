import * as functions from "firebase-functions";
import { userAuthApp } from './auth/user-auth';
import { tasksCrudApp } from './tasks/tasks-crud';

export const userAuth = functions.https.onRequest(userAuthApp);
export const tasks = functions.https.onRequest(tasksCrudApp);
