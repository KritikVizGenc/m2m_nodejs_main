const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../database');

const User =  sequelize.define('user_table', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_role: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    defaultValue: [],
    allowNull: true

  }
  
});

const Role = sequelize.define('role_table', {

  role_name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

const USER_HAS_ROLE = sequelize.define('user_has_role', {

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });


const USER_INFORMATION = sequelize.define('user_information', {

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  profile_picture:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  about_me:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  city:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  tag_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
  

  });

const USER_HAS_INFO = sequelize.define('user_has_info', {
    user_info_id :{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id:{
      type: DataTypes.STRING,
      allowNull: false,
    },
});

const TAG_TABLE = sequelize.define('tag_table', {
    tag_name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
});

const USER_HAS_TAG = sequelize.define('user_has_tags', {
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_info_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: false
    },
    user_tag_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: false,
      
    },
})

const PERMISSION_TABLE = sequelize.define('permission_table', {
    description:{
      type: DataTypes.STRING,
      allowNull: false,
    },
})

const MENTOR_MENTEE_REL = sequelize.define('mentor_mentee_rel', {
  id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user_tables',
      key: 'id',
    },
  },
  rel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user_tables',
      key: 'id',
    },
  },
})

  MENTOR_MENTEE_REL.belongsTo(User, { as: 'myMentors', foreignKey: 'rel_id'});
  MENTOR_MENTEE_REL.belongsTo(User, { as: 'myMentees', foreignKey: 'user_id'});
  User.hasMany(MENTOR_MENTEE_REL);

  

  Role.hasMany(User, {
    foreignKey: 'user_role'
  });
  User.hasMany(USER_HAS_ROLE, {
    foreignKey: 'user_id'
  });
  Role.hasMany(USER_HAS_ROLE, {
    foreignKey: 'role_id'
  });
  /////////////////////////////////////////////////
  TAG_TABLE.belongsToMany(USER_INFORMATION, {
    through: "user_has_tags",
    as:"user_information",
    foreignKey: "user_tag_id",
  })
  USER_INFORMATION.belongsToMany(TAG_TABLE, {
    through: "user_has_tags",
    as: "tag_table",
    foreignKey: "user_info_id",
  })
  TAG_TABLE.hasOne(USER_INFORMATION, {
    foreignKey: 'tag_id'
  })
  User.hasOne(USER_INFORMATION, {
    foreignKey: 'user_id'
  })


  sequelize.sync({ alter: true });

module.exports={Role, User, USER_HAS_ROLE, USER_INFORMATION, USER_HAS_INFO, TAG_TABLE, USER_HAS_TAG, PERMISSION_TABLE, MENTOR_MENTEE_REL};