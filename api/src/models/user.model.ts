import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../database/sequelize.js'

interface UserAttributes {
  UID: number
  Username: string
  Firstname: string
  Lastname: string
  Password: string
  Email: string
  Tlf: string
  FriendCode: number | null
}

type UserCreationAttributes = Optional<UserAttributes, 'UID' | 'FriendCode'>

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public UID!: number
  public Username!: string
  public Firstname!: string
  public Lastname!: string
  public Password!: string
  public Email!: string
  public Tlf!: string
  public FriendCode!: number | null
}

User.init(
  {
    UID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Tlf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    FriendCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: false,
  },
)

export default User
