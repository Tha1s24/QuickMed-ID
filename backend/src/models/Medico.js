// Exemplo de como um modelo seria definido usando uma ORM (como o Sequelize)

module.exports = (sequelize, DataTypes) => {
    const Medico = sequelize.define('Medico', {
        id: {
            type: DataTypes.UUID, // Tipo de dado
            primaryKey: true,
            allowNull: false
        },
        nome: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false
        },
        senha_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        crm: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: false
        },
        // ... (outros campos)
        ativo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'medicos' // Nome real da tabela no banco
    });

    // Definir relacionamento (se houver)
    Medico.associate = (models) => {
        Medico.hasMany(models.Carteirinha, { foreignKey: 'id_medico' });
    };

    return Medico;
};