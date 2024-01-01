const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.utils");

exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name can not be empty"));
  }
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.create(req.body);
    return res.status(201).json(document);
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const contactService = new ContactService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await contactService.findByName(name);
    } else {
      documents = await contactService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
  return res.json(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.json(document);
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty!"));
  }
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.update(req.params.id, req.body);
    console.log(req.params.id);
    console.log(req.body);
    console.log(document);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.json({ message: "Contact was updated successfully!" });
  } catch (error) {
    return new ApiError(500, error.message);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Contact not found!"));
    }
    return res.json({ message: "Contact was deleted successfully!!!" });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deleteCount = await contactService.deleteAll();
    return res.json({
      message: `${deleteCount.deletedCount} contacts were deleted successfully!!!`,
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

exports.findAllFavorite = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const documents = await contactService.findFavorite();
    console.log(documents);
    return res.json(documents);
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};
