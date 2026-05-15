import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import config from "./config";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
const port = config.port;

const pool = new Pool({
  connectionString:config.connection_string,
});

const initDB = async () => {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(20),
    email VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    age INT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `);
  } catch (error) {
    console.log(error);
  }
};
initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello, TypeScript Express!",
  });
});

app.post("/api/user", async (req: Request, res: Response) => {
  const { full_name, age, email, password } = req.body;

  try {
    const result = await pool.query(
      `
    INSERT INTO users ( full_name, age,email, password) VALUES($1,$2,$3,$4)
    RETURNING *
    `,
      [full_name, age, email, password],
    );
    console.log(result);

    res.status(201).json({
      message: "Posted Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users;
      `);
    res.status(200).json({
      message: "Users fetched successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
    SELECT * FROM users
    WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "User not Found"
      })
    }
    res.status(200).json({
      message: "Dynamic User fetched sucessfully",
      data: result.rows[0]
    })

  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      message: error.message,
      error: error
    });
  }
});

app.put("/api/user/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { full_name , age, is_active, email} = req.body;

  try {
    const result = await pool.query(
      `
    UPDATE users SET 
    full_name = COALESCE ($1, full_name),
    age = COALESCE ($2, age),
    is_active =COALESCE ($3, is_active),
    email = COALESCE($4, email)
    WHERE id = $5
    RETURNING *
    `,
      [full_name, age, is_active, email, id],
    );
    if(result.rows.length ===0){
      res.status(404).json({
        message:"User Not Fonud",
      })
    }
    res.status(200).json({
      message: "user updated",
      data: result.rows[0],
    });

  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      error: error
    })
  }
})
// recomended patch
// app.patch("/api/user/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const updates = req.body;

//   try {
//     const keys = Object.keys(updates);

//     if (keys.length === 0) {
//       return res.status(400).json({
//         message: "No data provided",
//       });
//     }

//     const fields = keys.map((key, index) => `${key} = $${index + 1}`);
//     const values = Object.values(updates);

//     const query = `
//       UPDATE users
//       SET ${fields.join(", ")}
//       WHERE id = $${keys.length + 1}
//       RETURNING *
//     `;

//     const result = await pool.query(query, [...values, id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       message: "User updated successfully",
//       data: result.rows[0],
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       message: error.message,
//       error,
//     });
//   }
// });

app.delete("/api/user/:id", async(req:Request, res:Response)=>{
  const {id} = req.params
try {
  const result = await pool.query(`
    DELETE FROM users
    WHERE id = $1;`, [id]
  );
  if(result.rowCount ===0){
    res.status(404).json({
      message:"User not found"
    })
  }

  res.status(200).json({
    message:"User deleted"
  })
  
} catch (error:any) {
  console.log(error)
  res.status(500).json({
    message:error.message,
    error:error
  })
}

})


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
