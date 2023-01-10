import { DataTypes } from "sequelize";

/**
 * Post Schema
 */
export default {
  name: "Post",
  attribute: {
    post_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    post_description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "test desc",
    },
    color: {
      type: DataTypes.TEXT,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
      field: 'user_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  others: {},
};
