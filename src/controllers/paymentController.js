import { QueryTypes } from 'sequelize';
import Payment from '../models/Payment.js';
import Rental from '../models/Rental.js';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';
import Insurance from '../models/Insurance.js';

class PaymentController {
  async create(req, res) {
    try {
      const { rental_id, valor, data, metodo_pagamento } = req.body;

      if (Number(valor) <= 0) {
        return res.status(400).json({ error: 'O valor do pagamento deve ser maior que zero.' });
      }

      const rental = await Rental.findByPk(rental_id);
      if (!rental) {
        return res.status(404).json({ error: 'Aluguel não encontrado.' });
      }

      const idLogado = req.userId;
      if (rental.usuario_id !== idLogado) {
        const usuarioLogado = await User.findByPk(idLogado);
        if (!usuarioLogado || !usuarioLogado.is_admin) {
          return res.status(403).json({
            error: 'Acesso negado. Você só pode pagar os seus próprios aluguéis.',
          });
        }
      }

      const vehicle = await Vehicle.findByPk(rental.veiculo_id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Veículo do aluguel não encontrado.' });
      }
      // Calcula o valor total do aluguel 
      const inicio = new Date(rental.data_inicio);
      const fim = new Date(rental.data_fim);
      const dias = Math.max(1, Math.ceil(Math.abs(fim - inicio) / (1000 * 60 * 60 * 24)));
      const valorDiarias = Number((dias * Number(vehicle.valor)).toFixed(2));

      const valorSeguro = Number(
        await Insurance.sum('valor', { where: { aluguel_id: rental_id, status: 'ativo' },}) ) || 0;
      
      const valorTotalAluguel = Number((valorDiarias + valorSeguro).toFixed(2));

      // Soma quanto já foi pago anteriormente para esse aluguel
      const totalJaPago = Number(await Payment.sum('valor', { where: { rental_id } })) || 0;
      const restanteAntes = Number((valorTotalAluguel - totalJaPago).toFixed(2));

      if (restanteAntes <= 0) {
        return res.status(400).json({ error: 'Este aluguel já está totalmente quitado.' });
      }

      if (Number(valor) > restanteAntes) {
        return res.status(400).json({
          error: `Valor maior que o saldo devedor. Falta pagar apenas R$ ${restanteAntes.toFixed(2)}.`,
        });
      }

      const payment = await Payment.create({ rental_id, valor, data, metodo_pagamento });

      const novoTotalPago = Number((totalJaPago + Number(valor)).toFixed(2));
      const faltaPagar = Number((valorTotalAluguel - novoTotalPago).toFixed(2));

      return res.status(201).json({
        payment,
        resumo_financeiro: {
          valor_total_aluguel: valorTotalAluguel,
          total_pago: novoTotalPago,
          falta_pagar: faltaPagar,
          quitado: faltaPagar === 0,
        },
      });
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

      const rental = await Rental.findByPk(payment.rental_id);
      const idLogado = req.userId;

      if (rental && rental.usuario_id !== idLogado) {
        const usuarioLogado = await User.findByPk(idLogado);
        if (!usuarioLogado || !usuarioLogado.is_admin) {
          return res.status(403).json({
            error: 'Acesso negado. Você só pode visualizar os seus próprios pagamentos.',
          });
        }
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
      const relatorio = await Payment.sequelize.query(
        `
        SELECT 
          p.id,
          p.valor,
          p.data,
          p.metodo_pagamento,
          r.id AS rental_id,
          r.usuario_id,
          r.veiculo_id,
          r.data_inicio,
          r.data_fim
        FROM payments p
        INNER JOIN rentals r ON p.rental_id = r.id
        ORDER BY p.data DESC;
        `,
        { type: QueryTypes.SELECT }
      );

      return res.status(200).json(relatorio);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new PaymentController();