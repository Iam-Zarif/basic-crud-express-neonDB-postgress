import fs from "fs";

import type { NextFunction, Request, Response } from "express";

 const logger = (req: Request, res: Response, next:NextFunction ) => {
  const log = `Method -> ${req.method} | Time -> ${Date.now()} | url -> ${req.url}\n`;
  fs.appendFile("logger.txt", log, (err: any) => {
    console.log(err);
  });
  next();
};

export default logger