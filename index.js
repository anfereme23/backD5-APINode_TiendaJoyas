import express from 'express'
import consultas from './consultas.js'
const app = express()

// Define the logRequest middleware
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

app.use(logRequest);

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log('Server ON'))

app.get('/joyas', async (req, res) => {
  const queryStrings = req.query;
  const joyas = await consultas.obtenerJoyas(queryStrings)
  const HATEOAST = await consultas.prepararHATEOAS(joyas)
  res.json(HATEOAST)
})


app.get('/joyas/filtros', async (req, res) => {
  const queryStrings = req.query
  const joyas = await consultas.obtenerJoyasPorFiltros(queryStrings)
  res.json(joyas)
 })


 app.get('/joyas/:limits', async (req, res) => {
  const joyas = await consultas.obtenerJoyas(req.params)
  res.json(joyas)
})

app.get("*", (req, res) => {
  res.status(404).send("Esta ruta no existe")
  })
  

