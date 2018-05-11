module.exports = function(sequelize, DataTypes) {
  const contacts = sequelize.define('contacts', {
    contactId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    addedBy: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    idUser: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    howWrite: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    date: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      }
    }
  })
  return contacts;
};
