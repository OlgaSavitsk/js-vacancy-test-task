import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
} from 'firebase/storage';

import type { File } from '@koa/multer';

import config from 'config';

import * as helpers from './cloud-storage.helper';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: config.FIREBASE_API_KEY,
  authDomain: config.FIREBASE_AUTH_DOMAIN,
  projectId: config.FIREBASE_PROJECT_ID,
  storageBucket: config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
  appId: config.FIREBASE_APP_ID,
  measurementId: config.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const uploadPublic = async (fileName: string, file: File) => {
  const storageRef = ref(storage, fileName);
  const uploadTask = await uploadBytes(storageRef, file.buffer, {
    contentType: 'image/jpeg',
  });
  return getDownloadURL(uploadTask.ref);
};

const deleteFile = async (fileName: string) => {
  const storageRef = ref(storage, fileName);
  await deleteObject(storageRef);
};

export default {
  helpers,
  uploadPublic,
  deleteFile,
};
