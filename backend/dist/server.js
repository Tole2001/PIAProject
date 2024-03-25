"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_routes_1 = __importDefault(require("./routers/user.routes"));
const multer_1 = __importDefault(require("multer"));
const path = require('path');
const fs = require('fs');
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
mongoose_1.default.connect('mongodb://127.0.0.1:27017/PiaProjekat');
const conn = mongoose_1.default.connection;
conn.once('open', () => {
    console.log("DB ok");
});
const router = express_1.default.Router();
router.use('/users', user_routes_1.default);
app.use("/", router);
app.use('/uploads', express_1.default.static(path.join(__dirname, '../uploads')));
app.post('/upload', upload.single('profileImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    const imagePath = `/uploads/${req.file.filename}`;
    res.status(200).json({ message: 'File uploaded successfully.', filename: imagePath, filePath: filePath });
});
app.get('/pdf/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading PDF file:', err);
            res.status(500).json({ error: 'Error reading PDF file' });
        }
        else {
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
