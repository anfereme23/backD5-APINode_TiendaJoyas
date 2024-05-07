import pg from "pg";
import format from "pg-format";
import { pool } from "./database/bd.js";

// Get Joyas
const obtenerJoyas = async ({ limits = 10, order_by="id_ASC", page = 1}) => {
    const [campo, direccion] = order_by.split("_");
    const offset = Math.abs((page -1) * limits)
    let formattedQuery = format("SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s", campo, direccion, limits, offset);
    pool.query(formattedQuery);
    try{
        const { rows: joyas } = await pool.query(formattedQuery)
        return joyas
    } catch(err){
        console.error("Error fetching jewelry", err);
        throw err;
    }
   }

   const obtenerJoyasPorFiltros = async ({ precio_max, precio_min, categoria, metal }) => {
    let filtros = []
    const values = []

    const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor)
        const { length } =filtros
        filtros.push(`${campo} ${comparador} $${length + 1}`)
    }

    if (precio_max) agregarFiltro('precio', '<=', precio_max)
    if (precio_min) agregarFiltro('precio', '>=', precio_min)
    if (categoria) agregarFiltro('categoria', '=', categoria)
    if (metal) agregarFiltro('metal', '=', metal)

    let consulta = "SELECT * FROM inventario"

    if (filtros.length > 0) {
        filtros = filtros.join(" AND ")
        consulta += ` WHERE ${filtros}`
    }
    try {
        const { rows: joyas } = await pool.query(consulta, values)
        return joyas
    } catch (err) {
        console.error("Error fetching jewelry by filters:", err)
        throw err
    }
   }

const prepararHATEOAS = (joyas) => {

    let stockTotal = 0
    const results = joyas.map((j) => {
        stockTotal += j.stock
        return {
            name: j.nombre,
            href: `/joyas/joyas/${j.id}`,
        }
    }).slice(0,6)
    const totalJoyas = joyas.length
    const HATEOAS = {
        totalJoyas,
        stockTotal,
        results
    }
    return HATEOAS
}

export default { obtenerJoyas, obtenerJoyasPorFiltros, prepararHATEOAS }