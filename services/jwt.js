import jwt from 'jwt-simple';
import moment from 'moment';

// cLAVE SECRETA
 const secret = 'SECRET_KEY_pRoJeCt_Social_Network_';

 //Generar token
 const createToken = (user)=> {
    const payload = {
        userId : user._id, 
        role: user.role,
        //Fecha de emisión
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    //Devolver jwt_token codificado
    return jwt.encode(payload,secret);
 };
 
export {
    secret,
    createToken
}