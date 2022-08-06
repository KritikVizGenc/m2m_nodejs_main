const { DataTypes } = require('sequelize');
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


const Meetings = sequelize.define('meet_table',{
  
  
  
  mentee_name: {
    type: DataTypes.STRING,
    allowNull:false
  },
  mentee_surname: {
    type: DataTypes.STRING,
    allowNull:false
  },
  meeting_date:  {
    type: DataTypes.DATE,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  
  message: {
    type: DataTypes.STRING,
    allowNull:false
  },
  


});

const USER_HAS_Meetings = sequelize.define('user_has_meeting', {
  id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  user_meeting_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: false
  },
  user_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: false,
    
  },

  

})




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
  
  Meetings.belongsToMany(User,{
    through: "user_has_meeting",
    as:"user_table",
    foreignKey: "user_meeting_id",

  })
  User.belongsToMany(Meetings,{
    through: "user_has_meeting",
    as:"user_table",
    foreignKey: "user_id",

  }

  )
  
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


  //sequelize.sync({ alter: true });

module.exports={Role, User, USER_HAS_ROLE, USER_INFORMATION, USER_HAS_INFO, TAG_TABLE, USER_HAS_TAG, PERMISSION_TABLE,Meetings,USER_HAS_Meetings};
