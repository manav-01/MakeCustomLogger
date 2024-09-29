import 'dotenv/config'
import express from 'express';
import logger from "./logger.js";
import morgan from "morgan";
// https://docs.chaicode.com/advance-node-logger/

const app = express();
const port = 3000;
let teaData = [];
let nextId = 1;

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
// must add to get or send data in req,res
app.use(express.json());    

app.post("/teas", (req, res) => {
    // console.log("Body", req.body);
    const {name, price} = req.body;
    const newTea = { id: nextId++, name, price };
    teaData.push(newTea);
    res.status(200).send(newTea);
})

// Get Data
app.get("/teas", (_, res) => {
    res.status(200).send(teaData);
})

// Send data base on Params
app.get("/teas/:id", (req, res) => {
    const newData = teaData.filter((t) => t.id === parseInt(req.params.id));
    // console.log("NewData",newData,teaData)
    if (!newData || newData.length ===0) {
        res.status(404).send("Tea not found")
    }

    res.status(200).send(newData);
})

// Update data
app.put("/teas/:id", (req, res) => {
    const tea = teaData.find((t) => t.id === parseInt(req.params.id));
    if (!tea) {
        res.status(404).send("Tea not found")
    }
    // console.log(tea)
    const { name, price } = req.body;
    tea.name = name,
    tea.price = price,
    res.status(200).send(tea);
})

// Delete Data
app.delete("/teas/:id", (req, res) => {
    const index = teaData.findIndex((t) => t.id === parseInt(req.params.id));

    if (index === -1) {
        res.status(404).send("Tea not Found")
    }
      teaData.splice(index,1)
    res.status(204).send("Successfully Deletes item");
})


app.get("/", (req, res) => {
    res.send("Hello from Express");
})
app.get("/ice-tea", (req, res) => {
    res.send("This is Ice Tea 👌👌👌👌");
})


app.listen(process.env.PORT, () => {
    // logger.info("Server is Running")
    console.log(`Server is running at port: http://127.0.0.1:${process.env.PORT}/`);
})