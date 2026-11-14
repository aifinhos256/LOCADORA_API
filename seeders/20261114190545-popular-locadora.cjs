'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const senhaHash = await bcrypt.hash('123456', 10);

    // 1. Inserir Usuários 
    const users = await queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Grazielly Noronha Sousa',
          age: 20,
          email: 'grazy@admin.br',
          password: senhaHash,
          is_admin: true,
          created_at: now,
          updated_at: now,
        },
        {
          name: 'Sofia Duarte',
          age: 21,
          email: 'sofia@locadora.com',
          password: senhaHash,
          is_admin: false,
          created_at: now,
          updated_at: now,
        },
        {
          name: 'Renan Pinheiro',
          age: 20,
          email: 'renan@locadora.com',
          password: senhaHash,
          is_admin: false,
          created_at: now,
          updated_at: now,
        },
        {
          name: 'Lucas Mendes',
          age: 27,
          email: 'lucas@locadora.com',
          password: senhaHash,
          is_admin: false,
          created_at: now,
          updated_at: now,
        },
        {
          name: 'Mariana Costa',
          age: 24,
          email: 'mariana@locadora.com',
          password: senhaHash,
          is_admin: false,
          created_at: now,
          updated_at: now,
        },
      ],
      { returning: true }
    );

    // 2. Inserir Veículos
    const vehicles = await queryInterface.bulkInsert(
      'vehicles',
      [
        {
          marca: 'Toyota',
          modelo: 'Corolla XEi',
          ano: 2024,
          placa: 'POX1A23',
          valor: 220.00,
          created_at: now,
          updated_at: now,
        },
        {
          marca: 'Honda',
          modelo: 'Civic Touring',
          ano: 2023,
          placa: 'RIA4B56',
          valor: 240.00,
          created_at: now,
          updated_at: now,
        },
        {
          marca: 'Fiat',
          modelo: 'Pulse Audace',
          ano: 2024,
          placa: 'FOR7C89',
          valor: 165.50,
          created_at: now,
          updated_at: now,
        },
        {
          marca: 'Volkswagen',
          modelo: 'T-Cross Highline',
          ano: 2025,
          placa: 'RUS2D34',
          valor: 210.00,
          created_at: now,
          updated_at: now,
        },
        {
          marca: 'Hyundai',
          modelo: 'HB20 Platinum',
          ano: 2024,
          placa: 'CEA5E67',
          valor: 145.00,
          created_at: now,
          updated_at: now,
        },
      ],
      { returning: true }
    );

    // 3. Inserir Aluguéis 
    const rentals = await queryInterface.bulkInsert(
      'rentals',
      [
        {
          usuario_id: users[1].id,
          veiculo_id: vehicles[0].id,
          data_inicio: new Date('2026-11-01'),
          data_fim: new Date('2026-11-04'),
          created_at: now,
          updated_at: now,
        },
        {
          usuario_id: users[2].id,
          veiculo_id: vehicles[1].id,
          data_inicio: new Date('2026-11-02'),
          data_fim: new Date('2026-11-06'),
          created_at: now,
          updated_at: now,
        },
        {
          usuario_id: users[3].id,
          veiculo_id: vehicles[2].id,
          data_inicio: new Date('2026-11-03'),
          data_fim: new Date('2026-11-05'),
          created_at: now,
          updated_at: now,
        },
        {
          usuario_id: users[4].id,
          veiculo_id: vehicles[3].id,
          data_inicio: new Date('2026-11-05'),
          data_fim: new Date('2026-11-08'),
          created_at: now,
          updated_at: now,
        },
        {
          usuario_id: users[0].id,
          veiculo_id: vehicles[4].id,
          data_inicio: new Date('2026-11-06'),
          data_fim: new Date('2026-11-08'),
          created_at: now,
          updated_at: now,
        },
        {
          usuario_id: users[1].id,
          veiculo_id: vehicles[2].id,
          data_inicio: new Date('2026-11-08'),
          data_fim: new Date('2026-11-11'),
          created_at: now,
          updated_at: now,
        },
        {
          usuario_id: users[2].id,
          veiculo_id: vehicles[4].id,
          data_inicio: new Date('2026-11-09'),
          data_fim: new Date('2026-11-13'),
          created_at: now,
          updated_at: now,
        },
        {
          usuario_id: users[3].id,
          veiculo_id: vehicles[0].id,
          data_inicio: new Date('2026-11-10'),
          data_fim: new Date('2026-11-12'),
          created_at: now,
          updated_at: now,
        },
        {
          usuario_id: users[4].id,
          veiculo_id: vehicles[1].id,
          data_inicio: new Date('2026-11-11'),
          data_fim: new Date('2026-11-14'),
          created_at: now,
          updated_at: now,
        },
        {
          usuario_id: users[1].id,
          veiculo_id: vehicles[3].id,
          data_inicio: new Date('2026-11-12'),
          data_fim: new Date('2026-11-14'),
          created_at: now,
          updated_at: now,
        },
      ],
      { returning: true }
    );

    // 4. Inserir Pagamentos correspondentes 
    await queryInterface.bulkInsert('payments', [
      // Com seguro
      { rental_id: rentals[0].id, valor: 810.00, data: '2026-11-01', metodo_pagamento: 'PIX', created_at: now, updated_at: now },
      { rental_id: rentals[4].id, valor: 400.00, data: '2026-11-06', metodo_pagamento: 'PIX', created_at: now, updated_at: now },

      // Com seguro e formas diferentes
      { rental_id: rentals[1].id, valor: 400.00, data: '2026-11-02', metodo_pagamento: 'Dinheiro', created_at: now, updated_at: now },
      { rental_id: rentals[1].id, valor: 650.00, data: '2026-11-02', metodo_pagamento: 'Cartão de Crédito', created_at: now, updated_at: now },
      
      { rental_id: rentals[3].id, valor: 370.00, data: '2026-11-05', metodo_pagamento: 'Cartão de Débito', created_at: now, updated_at: now },
      { rental_id: rentals[3].id, valor: 400.00, data: '2026-11-05', metodo_pagamento: 'Cartão de Crédito', created_at: now, updated_at: now },
            
      { rental_id: rentals[8].id, valor: 270.00, data: '2026-11-11', metodo_pagamento: 'Dinheiro', created_at: now, updated_at: now },
      { rental_id: rentals[8].id, valor: 600.00, data: '2026-11-11', metodo_pagamento: 'PIX', created_at: now, updated_at: now },
      
      // Sem seguro
      { rental_id: rentals[2].id, valor: 331.00, data: '2026-11-03', metodo_pagamento: 'Cartão de Débito', created_at: now, updated_at: now },
      { rental_id: rentals[5].id, valor: 496.50, data: '2026-11-08', metodo_pagamento: 'Cartão de Crédito', created_at: now, updated_at: now },
      { rental_id: rentals[6].id, valor: 580.00, data: '2026-11-09', metodo_pagamento: 'Cartão de Débito', created_at: now, updated_at: now },
      { rental_id: rentals[7].id, valor: 440.00, data: '2026-11-10', metodo_pagamento: 'PIX', created_at: now, updated_at: now },
      { rental_id: rentals[9].id, valor: 420.00, data: '2026-11-12', metodo_pagamento: 'PIX', created_at: now, updated_at: now },
    ]);

    // 5. Inserir Seguros vinculados aos aluguéis 
    await queryInterface.bulkInsert('insurances', [
      { aluguel_id: rentals[0].id, tipo_seguro: 'Completo', status: 'ativo', valor: 150.00, created_at: now, updated_at: now },
      { aluguel_id: rentals[1].id, tipo_seguro: 'Terceiros', status: 'ativo', valor: 90.00, created_at: now, updated_at: now },
      { aluguel_id: rentals[2].id, tipo_seguro: 'Básico', status: 'inativo', valor: 65.00, created_at: now, updated_at: now },
      { aluguel_id: rentals[3].id, tipo_seguro: 'Completo', status: 'ativo', valor: 140.00, created_at: now, updated_at: now },
      { aluguel_id: rentals[4].id, tipo_seguro: 'Vidros e Roubo', status: 'ativo', valor: 110.00, created_at: now, updated_at: now },
      { aluguel_id: rentals[6].id, tipo_seguro: 'Básico', status: 'inativo', valor: 65.00, created_at: now, updated_at: now },
      { aluguel_id: rentals[8].id, tipo_seguro: 'Completo', status: 'ativo', valor: 150.00, created_at: now, updated_at: now },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('insurances', null, {});
    await queryInterface.bulkDelete('payments', null, {});
    await queryInterface.bulkDelete('rentals', null, {});
    await queryInterface.bulkDelete('vehicles', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};