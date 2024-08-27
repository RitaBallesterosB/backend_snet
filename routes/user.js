import { Router} from "express";
const router = Router();
import {testUser, register, login, profile, listUsers, updateUser, uploadAvatar } from "../controllers/user.js";
import { ensureAuth } from "../middlewares/auth.js";
import multer from 'multer';

//Configuración de subida de Archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatar")
    },
    filename: (re, file, cb) => {
        cb(null, "avatar-"+Date.now()+ "-"+file.originalname);
    }
});

const uploads = multer({storage});

//Definir las rutas


router.get('/test-user', ensureAuth, testUser);
router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', ensureAuth, profile);
router.get('/list/:page?', ensureAuth, listUsers);
router.put('/update', ensureAuth, updateUser);
router.post('/upload-avatar', [uploads.single("file0")], uploadAvatar);


//Exportar el Router
export default router;