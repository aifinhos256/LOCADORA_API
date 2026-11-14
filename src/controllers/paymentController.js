import Payment from '../models/Payment.js';
import Rental from '../models/Rental.js';

class PaymentController {
  async create(req, res) {
    try {
      const { rental_id, valor, data, metodo_pagamento } = req.body;

      const rental = await Rental.findByPk(rental_id);
      if (!rental) {
        return res.status(404).json({ error: 'Aluguel não encontrado.' });
      }

      const payment = await Payment.create({ rental_id, valor, data, metodo_pagamento });
      return res.status(201).json(payment);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const payments = await Payment.findAll();
      return res.status(200).json(payments);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const payment = await Payment.findByPk(req.params.id);
      if (!payment) {
        return res.status(404).json({ error: 'Pagamento não encontrado.' });
      }
      return res.status(200).json(payment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { valor, data, metodo_pagamento } = req.body;
      const payment = await Payment.findByPk(req.params.id);

      if (!payment) {
        return res.status(404).json({ error: 'Pagamento não encontrado.' });
      }

      await payment.update({ valor, data, metodo_pagamento });
      return res.status(200).json(payment);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const payment = await Payment.findByPk(req.params.id);
      if (!payment) {
        return res.status(404).json({ error: 'Pagamento não encontrado.' });
      }

      await payment.destroy();
      return res.status(200).json({ message: 'Pagamento removido com sucesso.' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async relatorio(req, res) {
    try {
      const relatorio = await Payment.findAll({
        attributes: ['id', 'valor', 'data', 'metodo_pagamento'],
        include: [
          {
            model: Rental,
            as: 'rental',
            required: true,
            attributes: ['id', 'usuario_id', 'veiculo_id', 'data_inicio', 'data_fim'],
          },
        ],
        order: [['data', 'DESC']],
      });

      return res.status(200).json(relatorio);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new PaymentController();