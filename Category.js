const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const filePath = './categories.json';

function readJsonFile() {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

function writeJsonFile(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.post('/categories', (req, res) => {
    const { name, description } = req.body;
    const category = {
        id: Date.now().toString(),
        name,
        description,
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    const data = readJsonFile();
    data.categories.push(category);
    writeJsonFile(data);
    res.status(201).json(category);
});

app.get('/categories', (req, res) => {
    const data = readJsonFile();
    res.json(data.categories.filter(category => !category.isDeleted));
});

app.get('/categories/:id', (req, res) => {
    const data = readJsonFile();
    const category = data.categories.find(category => category.id === req.params.id && !category.isDeleted);
    if (category) {
        res.json(category);
    } else {
        res.status(404).send('Category not found');
    }
});

app.put('/categories/:id', (req, res) => {
    const data = readJsonFile();
    const category = data.categories.find(category => category.id === req.params.id && !category.isDeleted);
    if (category) {
        Object.assign(category, req.body, { updatedAt: new Date().toISOString() });
        writeJsonFile(data);
        res.json(category);
    } else {
        res.status(404).send('Category not found');
    }
});

app.delete('/categories/:id', (req, res) => {
    const data = readJsonFile();
    const category = data.categories.find(category => category.id === req.params.id);
    if (category) {
        category.isDeleted = true;
        category.updatedAt = new Date().toISOString();
        writeJsonFile(data);
        res.json(category);
    } else {
        res.status(404).send('Category not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});