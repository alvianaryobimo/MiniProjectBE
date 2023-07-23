'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LikeBlogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LikeBlogs.belongsTo(models.Blog, {
        foreignKey: "blogId",
        as: "article"
      });
      LikeBlogs.belongsTo(models.Profile, {
        foreignKey: "profileId",
        as: "user"
      });
    }
  }
  LikeBlogs.init({
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'LikeBlogs',
  });
  return LikeBlogs;
};