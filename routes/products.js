const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../db');

// GET all products
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Product');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET product by ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Id', sql.BigInt, id)
            .query('SELECT * FROM Product WHERE Id = @Id');

        if (result.recordset.length === 0) return res.status(404).send('Product not found');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST create new product
router.post('/', async (req, res) => {
    const { Name, Detail, CategoryGroup, ImageUrl } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('Name', sql.VarChar(255), Name)
            .input('Detail', sql.NVarChar(4000), Detail)
            .input('CategoryGroup', sql.Int, CategoryGroup)
            .input('ImageUrl', sql.NVarChar(1000), ImageUrl)
            .query(`
                INSERT INTO Product (Name, Detail, CategoryGroup, ImageUrl)
                VALUES (@Name, @Detail, @CategoryGroup, @ImageUrl)
            `);
        res.status(201).send('Product created');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT update product
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { Name, Detail, CategoryGroup, ImageUrl } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('Id', sql.BigInt, id)
            .input('Name', sql.VarChar(255), Name)
            .input('Detail', sql.NVarChar(4000), Detail)
            .input('CategoryGroup', sql.Int, CategoryGroup)
            .input('ImageUrl', sql.NVarChar(1000), ImageUrl)
            .query(`
                UPDATE Product
                SET Name = @Name,
                    Detail = @Detail,
                    CategoryGroup = @CategoryGroup,
                    ImageUrl = @ImageUrl
                WHERE Id = @Id
            `);
        res.send('Product updated');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('Id', sql.BigInt, id)
            .query('DELETE FROM Product WHERE Id = @Id');
        res.send('Product deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
