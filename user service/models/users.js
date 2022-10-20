module.exports = (sequelize, DataTypes) => {

  //schema of user

  const user = sequelize.define('user', {
    customerID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,allowNull:false ,unique:true  },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,

    },
    phone: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    isVerified: { type: DataTypes.BOOLEAN, default: 0 },
    isAdmin:{type:DataTypes.BOOLEAN,default:0}
  
  },
  
    {
      freezeTableName: true,
      timestamps: true

    })
  return user;

}


