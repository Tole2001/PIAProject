import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'
import userRouter from './routers/user.routes';
import multer from 'multer';



const path = require('path');
const fs = require('fs');
const app = express();


app.use(cors())
app.use(express.json())


const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    cb(null,'uploads')
  },
  filename: (req,file,cb)=>{
    console.log(file)
    cb(null,Date.now() + path.extname(file.originalname) )
  }
})
const upload = multer({storage: storage});






mongoose.connect('mongodb://127.0.0.1:27017/PiaProjekat')
const conn = mongoose.connection
conn.once('open', ()=>{
    console.log("DB ok")
})








const router = express.Router()
router.use('/users', userRouter)

app.use("/" ,router)


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.post('/upload', upload.single('profileImage'), (req, res) => {

  if (!req.file) {
      return res.status(400).json({message:'No file uploaded.'});
  }
  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  const imagePath = `/uploads/${req.file.filename}`;

  res.status(200).json({ message: 'File uploaded successfully.', filename:  imagePath, filePath: filePath });
});


app.get('/pdf/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);

  fs.readFile(filePath, (err: NodeJS.ErrnoException | null, data: Buffer) => {
      if (err) {
          console.error('Error reading PDF file:', err);
          res.status(500).json({ error: 'Error reading PDF file' });
      } else {
          const base64Data = Buffer.from(data).toString('base64');
          const pdfData = {
              filename: req.params.filename,
              base64: base64Data
          };
          res.json(pdfData);
      }
  });
});




app.listen(4000, () => console.log(`Express server running on port 4000`));