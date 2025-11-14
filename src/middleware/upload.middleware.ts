import multer from 'multer';
import config from '../config';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to validate image mime types
const imageFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (config.allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${config.allowedImageTypes.join(', ')}`));
  }
};

// File filter to validate audio mime types
const audioFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (config.allowedAudioTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid audio type. Allowed types: ${config.allowedAudioTypes.join(', ')}`));
  }
};

// Configure multer upload for images
export const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: config.maxFileSize,
  },
});

// Configure multer upload for audio
export const uploadAudio = multer({
  storage,
  fileFilter: audioFileFilter,
  limits: {
    fileSize: config.maxAudioSize,
  },
});
