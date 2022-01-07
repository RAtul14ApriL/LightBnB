const { Client } = require('pg');

// const properties = require('./json/properties.json');
// const users = require('./json/users.json');
const client = new Client({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});

client.connect();

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return client
    .query(`SELECT * from users
    WHERE email = $1`, [email.toLowerCase()])
    .then(res => {
      return res.rows[0];
    })
    .catch(err => err.message)
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return client
    .query(`SELECT * from users WHERE id = $1`, [id])
    .then(res => res.rows[0])
    .catch(err => err.message)
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = `INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *`;
  const values = [user.name, user.email, user.password] 
  return client
    .query(queryString, values)
    .then(res => res.rows[0])
    .catch(err => err.stack);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return client
    .query(`SELECT * FROM reservations
    WHERE guest_id = $1
    AND start_date < Now()::date
    ORDER BY start_date DESC
    LIMIT $2`, [guest_id, limit = 10])
    .then(res => res.rows)
    .catch(err => err.stack);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  return client
    .query(`SELECT * FROM properties LIMIT $1`, [limit = 10])
    .then(res => res.rows)
    .catch(err => err.stack);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;