const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');
require('dotenv').config();
 
const app = express();
app.use(cors());
app.use(bodyParser.json());
 
const connectToDatabase = async () => {
    try{
        const client = await MongoClient.connect(process.env.MONGO_URI);
        console.log('Connected to database');
        return client.db(process.env.DB_NAME);
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
   
}
 
let database
 
const startServer = async () => {
    database = await connectToDatabase();
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}
 
startServer();

app.get('/articoli', async (req, res) => {
    if (!database) {
        res.status(500).json({message:'Database is not connected'});
    }
    try{
        const result = await database.collection('articoli').find({}).toArray();
        res.json(result);
    } catch {
        console.log(err);
        res.status(500).json({message: 'Error get utenti'});
    }
})

app.get('/carrello', async (req, res) => {
    if (!database) {
        res.status(500).json({message:'Database is not connected'});
    }
    try{
        const result = await database.collection('carrello').find({}).toArray();
        res.json(result);
    } catch {
        console.log(err);
        res.status(500).json({message: 'Error get utenti'});
    }
})

app.put('/aggiungiArticolo/:id_carrello', async(req, res) => {
    if (!database) {
        res.status(500).json({message:'Database is not connected'});
    }
    try {
        const carrello = req.params.id_carrello;
        const id = parseInt(carrello);
        const articolo = req.body;
        const result = await database.collection('carrello').updateOne(
            {id_carrello : id},
            {$addToSet : {articoli: articolo}}
        )
        if (result.matchedCount === 0) {
            return res.status(404).json({message: 'Utente non trovato'});
        }
        res.status(200).json({message: 'Error updating utente'})
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Error get utenti'});
    }
})

app.put('/rimuoviArticolo/:id_carrello/:id_articolo', async(req, res) => {
    if (!database) {
        res.status(500).json({message:'Database is not connected'});
    }
    try {
        const carrello = req.params.id_carrello;
        const id_car = parseInt(carrello);
        const articolo = req.params.id_articolo;
        const id_art= parseInt(articolo);
        const result = await database.collection('carrello').updateOne(
            {id_carrello : id_car},
            { $pull: { articoli: { Id_art: id_art} } }
        )
        if (result.matchedCount === 0) {
            return res.status(404).json({message: 'Utente non trovato'});
        }
        res.status(200).json({message: 'Error updating utente'})
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Error get utenti'});
    }
})

app.put('/svuotaCarrello/:id_carrello', async(req, res) => {
    if (!database) {
        res.status(500).json({message:'Database is not connected'});
    }
    try {
        const carrello = req.params.id_carrello;
        const id = parseInt(carrello);
        const result = await database.collection('carrello').updateOne(
            {id_carrello : id},
            {$set : {articoli: []} }
        )
        if (result.matchedCount === 0) {
            return res.status(404).json({message: 'Utente non trovato'});
        }
        res.status(200).json({message: 'Error updating utente'})
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Error get utenti'});
    }
})

app.post('/carrello', async (req, res) => {
    if (!database) {
        res.status(500).json({message:'Database is not connected'});
    }
    try{
        const {Id_art, nome_prodotto, descrizione_prodotto, categoria, marca, prezzo, 
            quantità, stato, sconto, origine, urlImg, fornitore, allergeni, ingredienti, rating, scaffale, corsia
        } = req.body;
        const result = await database.collection('carrello').insertOne({
            Id_art, 
            nome_prodotto, 
            descrizione_prodotto, 
            categoria, marca, prezzo, 
            quantità, 
            stato, 
            sconto, 
            origine, 
            urlImg, 
            fornitore, 
            allergeni, 
            ingredienti, 
            rating, 
            scaffale, 
            corsia
        })
        res.status(201).json({message:'Utente creato'});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Error get utenti'});
    }
})