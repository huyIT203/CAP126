var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');
let { CreateErrorRes, CreateSuccessRes } = require('../utils/responseHandler');

/* GET all categories */
router.get('/', async function(req, res, next) {
  try {
    let categories = await categoryModel.find({
      isDeleted: false
    });
    CreateSuccessRes(res, categories, 200);
  } catch (error) {
    next(error);
  }
});

/* GET category by id */
router.get('/:id', async function(req, res, next) {
  try {
    let category = await categoryModel.findOne({
      _id: req.params.id,
      isDeleted: false
    });
    if (category) {
      CreateSuccessRes(res, category, 200);
    } else {
      CreateErrorRes(res, "Category not found", 404);
    }
  } catch (error) {
    next(error);
  }
});

/* POST create new category */
router.post('/', async function(req, res, next) {
  try {
    let body = req.body;
    let newCategory = new categoryModel({
      name: body.name,
      description: body.description || '', // default empty string for description
    });
    await newCategory.save();
    CreateSuccessRes(res, newCategory, 201);
  } catch (error) {
    next(error);
  }
});

/* PUT update category */
router.put('/:id', async function(req, res, next) {
  let id = req.params.id;
  try {
    let body = req.body;
    let updatedInfo = {};

    if (body.name) {
      updatedInfo.name = body.name;
    }

    if (body.description) {
      updatedInfo.description = body.description;
    }

    let updatedCategory = await categoryModel.findByIdAndUpdate(id, updatedInfo, { new: true });

    if (updatedCategory) {
      CreateSuccessRes(res, updatedCategory, 200);
    } else {
      CreateErrorRes(res, "Category not found", 404);
    }
  } catch (error) {
    next(error);
  }
});

/* DELETE (soft delete) category */
router.delete('/:id', async function(req, res, next) {
  let id = req.params.id;
  try {
    let deletedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (deletedCategory) {
      CreateSuccessRes(res, deletedCategory, 200);
    } else {
      CreateErrorRes(res, "Category not found", 404);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
