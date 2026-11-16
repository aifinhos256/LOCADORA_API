import Vehicle from '../models/Vehicle.js'; 
import Rental from '../models/Rental.js'; // Ajuste o caminho se necessário para o model de locações
import { Op } from 'sequelize';
import { sequelize } from '../config/database.js'; // Ajuste para o caminho onde exporta a instância do sequelize do seu projeto

class VehicleController {
    async create(req, res) {
        try {
            const vehicleToCreate = {
                ...req.body
            };

            const vehicle = await Vehicle.create(vehicleToCreate);
            
            return res.status(201).json(vehicle);

        } catch (error) {
            return res.status(400).json({ error: 'Erro ao cadastrar veículo. Verifique os dados enviados.', details: error.message });
        }
    }

    async index(req, res) {
        try {
            const vehicles = await Vehicle.findAll();
            return res.status(200).json(vehicles);

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar veículos.' });
        }
    }

    async show(req, res) {
        try {
            const { identificador } = req.params;
            const vehicle = await Vehicle.findOne({
                where: {
                    [Op.or]: [
                        { id: isNaN(identificador) ? null : identificador },
                        { placa: identificador }
                    ]
                }
            });

            if (!vehicle) {
                return res.status(404).json({ error: 'Veículo não encontrado.' });
            }

            return res.status(200).json(vehicle);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar veículo.' });
        }
    }

    // NOVO MÉTODO DE BUSCA COM LIKE, JOIN E COUNT
    async search(req, res) {
        try {
            const { termo } = req.query; // Exemplo de uso: /vehicles/search?termo=Fiat

            const vehicles = await Vehicle.findAndCountAll({
                where: {
                    nome: { // Substitua 'nome' pelo campo real do seu model (ex: modelo, marca, etc.)
                        [Op.like]: `%${termo || ''}%`
                    }
                },
                include: [
                    {
                        model: Rental,
                        as: 'rentals', // Verifique se o alias ('as') na associação do model é 'rentals' ou outro
                        attributes: []
                    }
                ],
                attributes: {
                    include: [
                        [sequelize.fn('COUNT', sequelize.col('rentals.id')), 'total_locacoes']
                    ]
                },
                group: ['Vehicle.id'] // Necessário para agrupamento ao usar COUNT com JOIN
            });

            return res.status(200).json(vehicles);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar veículos.', details: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const vehicle = await Vehicle.findByPk(id);

            if (!vehicle) {
                return res.status(404).json({ error: 'Veículo não encontrado.' });
            }

            await vehicle.update(req.body);
            
            return res.status(200).json(vehicle);
        } catch (error) {
            return res.status(400).json({ error: 'Erro ao editar veículo.', details: error.message });
        }
    }

    async remove(req, res) {
        try {
            const { id } = req.params;
            const vehicle = await Vehicle.findByPk(id);

            if (!vehicle) {
                return res.status(404).json({ error: 'Veículo não encontrado.' });
            }

            await vehicle.destroy();
            return res.status(200).json({ message: 'Veículo removido com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao remover veículo.' });
        }
    }
}

export default new VehicleController();
