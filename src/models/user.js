"use strict";
var md5 = require('md5');

const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../database');
////////////////////resim için eklenen yeni kısım//////////////////////////
var fs = require('fs');
const { timeStamp } = require('console');
function base64_encode(file) {
  
  var bitmap = fs.readFileSync(file);
    
    return new Buffer(bitmap).toString('base64');
}


function base64_decode(base64str, file) {
    
    var bitmap = new Buffer(base64str, 'base64');
    
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}

// convert image to base64 encoded string
var base64str = base64_encode('src/models/default_m2m.jpg');
console.log(base64str);
// convert base64 string back to image 
base64_decode(base64str, 'copy_default_m2m.jpg');


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
  avatar: {

    type: DataTypes.STRING(10000000),
    defaultValue: base64str,
    allowNull: true

  },
  about_me:{
    type: DataTypes.STRING(1000),
    defaultValue:'',
    allowNull:true

  },
  city:{

    type: DataTypes.STRING,
    defaultValue:'',
    allowNull:true

  },

  work:{

    type: DataTypes.STRING,
    defaultValue:'',
    allowNull : true

  },
  socketID:{
    type:DataTypes.STRING(255),
    defaultValue:null,
    allowNull:true
  }
    }
  ,
{
timesStamps:false,
freezeTableName:true,
tableName:'user_table'
}
,{
  clasMethods:{
    associate:function(models){

    }
  }
});

User.associate = function(models){
  User.hasMany(models.messages,{
    onDelete:"CASCADE",
    foreignKey:'sender_id',
    targetKey:'id',
    as:'userMessages'
  });
};



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
      primaryKey: true,
      autoIncrement: true
    },
   user_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model:'user_table',
        key:'id'

      }
     
    },
    tag_id:{
      type: DataTypes.INTEGER,
     allowNull: false,
     references:{

      model:'tag_table',
      key:'id'

     }
      
    },
})

const messages = sequelize.define('messages',{
  id: {
    type: DataTypes.INTEGER.UNSIGNED ,
    primaryKey: true ,
    autoIncrement: true
},
message_subject : {
    type:DataTypes.STRING
},
message_body :{
    type: DataTypes.TEXT,
    allowNull:false
} ,
sender_id : {
    type: DataTypes.INTEGER.UNSIGNED ,
    allowNull: false,
    references: {
        model: "user_table",
        key: "id"
    }
},
receiver_id :{
    type: DataTypes.INTEGER.UNSIGNED ,
    allowNull: false,
    references: {
        model: "user_table",
        key: "id"
    }
},
conversation_id : {
    type:DataTypes.STRING,
    allowNull : false
} ,
created_at : {
    type: 'TIMESTAMP' ,
    allowNull: false,
    defaultValue: DataTypes.NOW
},
updated_at :{
    type: 'TIMESTAMP' ,
    allowNull: false,
    defaultValue: DataTypes.NOW
},
viewed : DataTypes.BOOLEAN
},
{
timestamps: false,
freezeTableName:true,
  tableName: 'messages'
}, {
classMethods: {
  associate: function(models) {
  }
}
});
messages.associate = function(models) {
    messages.belongsTo(models.User, {
        onDelete: "CASCADE",
        foreignKey:  'sender_id',
        targetKey: 'id',
        as :'user_table'
    });
};




////////////ROL KISMI////////////////
  Role.hasMany(User, {
    foreignKey: 'user_role'
  });
  User.hasMany(USER_HAS_ROLE, {
    foreignKey: 'user_id'
  });
  Role.hasMany(USER_HAS_ROLE, {
    foreignKey: 'role_id'
  });
  ///////////////////TAG KISMI//////////////////////////////
  User.belongsToMany(TAG_TABLE,{
    through: "user_has_tags",
    as:"TAG_TABLE",
    foreignKey:"user_id",
  });

  TAG_TABLE.belongsToMany(User,{
    through: "user_has_tags",
    as:"User",
    foreignKey:"tag_id",
  });

  
  USER_HAS_TAG.belongsTo(User,{as:'user_tag',foreignKey:'user_id'});
  User.hasMany(USER_HAS_TAG);
  USER_HAS_TAG.belongsTo(TAG_TABLE,{as:'tag_tag',foreignKey:'tag_id'});
  TAG_TABLE.hasMany(USER_HAS_TAG);

  /////////////////Chat Kısmı//////////////////////7

  
  


  sequelize.sync({ alter: true });

module.exports={Role, User, USER_HAS_ROLE, TAG_TABLE, USER_HAS_TAG};