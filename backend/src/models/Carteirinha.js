// Exemplo de como um modelo seria definido usando uma ORM (como o Sequelize)

module.exports = (sequelize, DataTypes) => {
    const Carteirinha = sequelize.define('Carteirinha', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false
        },
        id_medico: {
            type: DataTypes.UUID,
            allowNull: false,
            // Adicionar uma referência à tabela Medicos
            references: {
                model: 'medicos',
                key: 'id',
            }
        },
        nome_paciente: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        // ... (outros campos)
        data_validade: {
            type: DataTypes.DATEONLY, // Apenas data
            allowNull: false
        },
        codigo_validacao: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    }, {
        tableName: 'carteirinhas'
    });

    // Definir relacionamento (se houver)
    Carteirinha.associate = (models) => {
        Carteirinha.belongsTo(models.Medico, { foreignKey: 'id_medico' });
    };

    return Carteirinha;
};