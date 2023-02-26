module.exports = (sequelize, DataTypes) => {

    const Image = sequelize.define("image", {
            image_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            file_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            date_created: {
                type: DataTypes.STRING,
                allowNull: false
            },
            s3_bucket_path: {
                type: DataTypes.STRING,
                allowNull: false
            }

        },
        {
            timestamps: false
        })
    return Image
}