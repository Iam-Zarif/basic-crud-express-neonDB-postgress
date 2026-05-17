import { pool } from "../../db"

const createProfileintoDB = async (payload:any) => {

    const {user_id, bio, address, phone, gender} = payload

   const user = await pool.query(`
    SELECT * FROM users WHERE id=$1
    `,[user_id])

    if(user.rows.length === 0){
        throw new Error("user not exist")
    }
    console.log("user" , user.rows)

    const result = await pool.query(
      `
        INSERT INTO profile (user_id, bio, address, phone, gender)
        VALUES($1, $2, $3, $4, $5) 
        RETURNING *
        `,
      [user_id, bio, address, phone, gender],
    );
    return result
}

export const profileService = {
    createProfileintoDB
}