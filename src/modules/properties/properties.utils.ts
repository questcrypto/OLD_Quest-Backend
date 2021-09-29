import { extname } from "path";


export const filenames = (req, file, callback):any => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    }



    export const editFileName = (req, file, callback) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        console.log(`${randomName}${extname(file.originalname)}`);
        return callback(null, `${randomName}${extname(file.originalname)}`)
      };