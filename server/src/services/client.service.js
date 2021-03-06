const httpStatus = require('http-status');
const { Client, User } = require('../models');
const ApiError = require('../utils/ApiError');

/*
 * Create a Client
 * @param {Object} ClientBody
 * @returns {Promise<Client>}
 */
const createClient = async (clientBody) => {
  // check if the client exists
  const client = await Client.findOne({ email: clientBody.email });
  if (client) {
    return ({
      status: false,
      client
    })
  }
  
  const newClient = await Client.create(clientBody);
  // update in user collection also
  await User.findByIdAndUpdate(clientBody.user, {
    $push: { customers: newClient._id }
  })

  return ({
    status: true,
    newClient
  })
};

/*
 * Query for Clients
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryClients = async (filter, options) => {
  const clients = await Client.paginate(filter, options);
  return clients;
};

/**
 * Get Client by id
 * @param {ObjectId} id
 * @returns {Promise<Client>}
 */
const getClientById = async (id) => {
  return Client.findById(id);
};

/**
 * Get Client by email
 * @param {string} email
 * @returns {Promise<Client>}
 */
const getClientByEmail = async (email) => {
  return Client.findOne({ email });
};

/**
 * Get Client by name
 * @param {string} name
 * @returns {Promise<Client>}
 */
 const getClientByName = async (name) => {
  return Client.find({ name });
};

/**
 * Update Client by id
 * @param {ObjectId} ClientId
 * @param {Object} updateBody
 * @returns {Promise<Client>}
 */
const updateClientById = async (clientId, updateBody) => {
  return await Client.findOneAndUpdate(clientId, updateBody, { new: true });
};

/**
 * Update Client by email
 * @param {ObjectId} clientEmail
 * @param {Object} updateBody
 * @returns {Promise<Client>}
 */
 const updateClientByEmail = async (clientEmail, updateBody) => {
  console.log(clientEmail);
  return await Client.findOneAndUpdate({
    email: clientEmail
  }, updateBody, { new: true });
};

/**
 * Delete Client by id
 * @param {ObjectId} ClientId
 * @returns {Promise<Client>}
 */
const deleteClientById = async (ClientId) => {
  const Client = await getClientById(ClientId);
  if (!Client) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Client not found');
  }
  await Client.remove();
  return Client;
};

module.exports = {
  createClient,
  queryClients,
  getClientById,
  getClientByEmail,
  updateClientById,
  deleteClientById,
  getClientByName,
  updateClientByEmail
};
