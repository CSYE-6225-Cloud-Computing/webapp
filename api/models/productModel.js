module.exports = (sequelize, DataTypes) => {

    const Product = sequelize.define("product", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            sku: {
                type: DataTypes.STRING,
                allowNull: false
            },
            manufacturer: {
                type: DataTypes.STRING,
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            date_added: {
                type: DataTypes.STRING,
                allowNull: false
            },
            date_last_updated: {
                type: DataTypes.STRING,
                allowNull: false
            },
            owner_user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }

        },
        {
            timestamps: false
        })
    return Product
}