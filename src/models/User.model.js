modules.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        UID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Tlf: {
            type: DataTypes.STRING,
            allowNull: false
        },
        FriendCode: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    });
    return User;
};


-Username
-Firstname nvarchar(30)
-Lastname nvarchar(30)
-Password nvarchar(20)
-Email nvarchar(50)
-Tlf nvarchar(15)
-FriendCode int