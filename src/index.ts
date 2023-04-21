import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import * as morgan from 'morgan';
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

import { User } from "./entity/User"

import { port } from "./config"

// console.log("hello world");

function handleError(err, req, res, next) {
    res.status(err.statusCode || 500).send({message: err.message});
}

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    // app.use(bodyParser.json())

    app.use(morgan('tiny'));

    app.use(bodyParser.urlencoded({
        extended: true
    })).use(express.json({ limit: '1mb' }));

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, upload.array('images', 12) ,async (req: Request, res: Response, next: Function) => {
            
            try {
                const result = await (new (route.controller as any))[route.action](req, res, next)
                res.json(result)
                
            } catch(error) {
                next(error);
            }


        })
    })

    // setup express app here
    // ...

    // start express server
    app.use(handleError);
    app.listen(port);

    // insert new users for test
    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(User, {
    //         firstName: "Timber",
    //         lastName: "Saw",
    //         age: 27
    //     })
    // )



    console.log(`Express server has started on ${port}`)

}).catch(error => console.log(error))
