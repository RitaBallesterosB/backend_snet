import User from "../models/users.js";
import bcrypt from "bcrypt";
import {createToken} from '../services/jwt.js'



//Método de prueba
export const testUser = (req,res) => {
    return res.status(200).send ({
        message: "Mensaje enviado desde el controlador user.js"
    });
}


// Método Registro de Usuarios

export const register = async(req, res) => {
    try {
        // Obtener los datos de la petición
        let params = req.body;
        

        //Validaciones de los datos obtenidos
        if (!params.name || !params.last_name || !params.email || !params.password || !params.nick)
        {
            return res.status(400).send({
                status: "error",
                mesagge: "Faltan datos por enviar"
            });
        }


           // Crear el objeto de usuario con los datos que ya validamos
    let user_to_save = new User(params);
    user_to_save.email = params.email.toLowerCase()

    // Busca si ya existe un usuario con el mismo email o nick
    const existingUser = await User.findOne({
      $or: [
        { email: user_to_save.email.toLowerCase() },
        { nick: user_to_save.nick.toLowerCase() }
      ]
    });

    // Si encuentra un usuario, devuelve un mensaje indicando que ya existe
    if(existingUser) {
      return res.status(409).send({
        status: "error",
        message: "!El usuario ya existe!"
      });
    }

  // Cifra la contraseña antes de guardarla en la base de datos
  const salt = await bcrypt.genSalt(10); // Genera una sal para cifrar la contraseña
  const hashedPassword = await bcrypt.hash(user_to_save.password, salt); // Cifra la contraseña
  user_to_save.password = hashedPassword; // Asigna la contraseña cifrada al usuario

    // Guardar el usuario en la base de datos
    await user_to_save.save();

    // Devolver el usuario registrado
    return res.status(200).json({
      status: "success",
      message: "Registro de usuario exitoso",
      //params,
      user_to_save
    });
       
    } catch (error) {
        // manejo de errores
        console.log("Error en el registo de usuario", error);
        //Devuelve mensaje de error 
        return res.status(500).send({
             status: "error",
             message: "Error en el registro de usuario"
        });
     
    }
     
}

//___________________________________________________
//Método de autenticación (login) usando JWT

export const login = async(req, res) =>{
  try {
    // Obtener los parámetros del body

    let params = req.body;


    // Validar parámetro: emial, password
    if (!params.email|| !params.password) {
      return res.status(400).send({
        status: "error",
        mesagge: " Faltan datos por enviar"
      });
    }

    // Buscar en la DB si existe ese email recibido
    const user = await User.findOne({ email: params.email.toLowerCase ()});


    //Si no existe el usuario

    if (!user) {
      return res.status(404).send({
        status: "error",
        mesagge: " Usuario no encontrado"
      });  
    }

    // Comprobar la contraseña

    const validPassword = await bcrypt.compare(params.password, user.password );

    // si la contraseña es incorrecta

    if (!validPassword) {
      return res.status(401).send({
        status: "error",
        mesagge: " Contraseña incorrecta"
      }); 
      
    }

    // Generar token de autenticación

    const token = createToken(user);

    // Devolver Token y datos del uusario autenticado

    return res.status(200).json({
      status: "succes",
      mesagge: "LOGIN EXITOSO",
      token,
      user: {
        id: user._id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        nick: user.nick,
        image:user.image,
        created_at: user.created_at
      }
    });
    
  } catch (error) {
     // manejo de errores
     console.log("Error en la autenticación  de usuario", error);
     //Devuelve mensaje de error 
     return res.status(500).send({
          status: "error",
          message: "Error en la autenticación de usuario"
     });
  }
}