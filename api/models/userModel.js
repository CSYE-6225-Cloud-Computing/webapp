module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("user", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            account_created: {
                type: DataTypes.STRING,
                allowNull: false
            },
            account_updated: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            timestamps: false
        })
    return User
}