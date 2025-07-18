import { PrismaClient, UserRole, ProcessType, ProcessStatus } from '@prisma/client';
import { PasswordUtils } from '@/utils/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.movement.deleteMany();
  await prisma.deadline.deleteMany();
  await prisma.audience.deleteMany();
  await prisma.task.deleteMany();
  await prisma.process.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  const adminPassword = await PasswordUtils.hash('Admin123!');
  const advogadoPassword = await PasswordUtils.hash('Advogado123!');
  const assistentePassword = await PasswordUtils.hash('Assistente123!');

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador Sistema',
      email: 'admin@plataformagestao.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  const advogado1 = await prisma.user.create({
    data: {
      name: 'Dr. João Silva',
      email: 'joao.silva@escritorio.com',
      password: advogadoPassword,
      role: UserRole.ADVOGADO,
    },
  });

  const advogado2 = await prisma.user.create({
    data: {
      name: 'Dra. Maria Santos',
      email: 'maria.santos@escritorio.com',
      password: advogadoPassword,
      role: UserRole.ADVOGADO,
    },
  });

  const assistente = await prisma.user.create({
    data: {
      name: 'Ana Oliveira',
      email: 'ana.oliveira@escritorio.com',
      password: assistentePassword,
      role: UserRole.ASSISTENTE,
    },
  });

  console.log('✅ Usuários criados');

  // Criar clientes
  const cliente1 = await prisma.client.create({
    data: {
      name: 'Empresa ABC Ltda',
      email: 'contato@empresaabc.com',
      phone: '(11) 99999-1111',
      document: '12.345.678/0001-90',
      type: 'PESSOA_JURIDICA',
      address: 'Rua das Empresas, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      notes: 'Cliente corporativo de grande porte',
    },
  });

  const cliente2 = await prisma.client.create({
    data: {
      name: 'Carlos Pereira',
      email: 'carlos@email.com',
      phone: '(11) 88888-2222',
      document: '123.456.789-01',
      type: 'PESSOA_FISICA',
      address: 'Av. Principal, 456',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-568',
      notes: 'Cliente pessoa física',
    },
  });

  const cliente3 = await prisma.client.create({
    data: {
      name: 'Indústria XYZ S.A.',
      email: 'juridico@industriaxyz.com',
      phone: '(11) 77777-3333',
      document: '98.765.432/0001-10',
      type: 'PESSOA_JURIDICA',
      address: 'Rod. Industrial, km 25',
      city: 'Guarulhos',
      state: 'SP',
      zipCode: '07000-000',
    },
  });

  console.log('✅ Clientes criados');

  // Criar processos
  const processo1 = await prisma.process.create({
    data: {
      number: '1001234-56.2023.8.26.0100',
      title: 'Ação Trabalhista - Empresa ABC',
      description: 'Reclamação trabalhista movida por ex-funcionário',
      type: ProcessType.TRABALHISTA,
      status: ProcessStatus.ATIVO,
      court: '1ª Vara do Trabalho de São Paulo',
      judge: 'Dra. Fernanda Lima',
      opposingParty: 'João dos Santos',
      value: 50000.00,
      startDate: new Date('2023-06-15'),
      clientId: cliente1.id,
      responsibleId: advogado1.id,
    },
  });

  const processo2 = await prisma.process.create({
    data: {
      number: '2001234-78.2023.8.26.0002',
      title: 'Ação Cível - Cobrança',
      description: 'Cobrança de serviços prestados',
      type: ProcessType.CIVIL,
      status: ProcessStatus.ATIVO,
      court: '2ª Vara Cível de São Paulo',
      judge: 'Dr. Roberto Costa',
      opposingParty: 'Empresa Devedora Ltda',
      value: 25000.00,
      startDate: new Date('2023-08-20'),
      clientId: cliente2.id,
      responsibleId: advogado2.id,
    },
  });

  const processo3 = await prisma.process.create({
    data: {
      number: '3001234-90.2023.8.26.0003',
      title: 'Ação Tributária - Indústria XYZ',
      description: 'Questionamento de autuação fiscal',
      type: ProcessType.TRIBUTARIO,
      status: ProcessStatus.ATIVO,
      court: '1ª Vara da Fazenda Pública',
      judge: 'Dr. Alberto Mendes',
      opposingParty: 'Fazenda do Estado de SP',
      value: 150000.00,
      startDate: new Date('2023-09-10'),
      clientId: cliente3.id,
      responsibleId: advogado1.id,
    },
  });

  console.log('✅ Processos criados');

  // Criar tarefas
  await prisma.task.createMany({
    data: [
      {
        title: 'Elaborar contestação',
        description: 'Preparar peça de defesa para o processo trabalhista',
        priority: 'ALTA',
        dueDate: new Date('2024-01-15'),
        assignedId: advogado1.id,
        createdById: admin.id,
        processId: processo1.id,
      },
      {
        title: 'Reunir documentos',
        description: 'Coletar documentação necessária para a defesa',
        priority: 'MEDIA',
        dueDate: new Date('2024-01-20'),
        assignedId: assistente.id,
        createdById: advogado1.id,
        processId: processo1.id,
      },
      {
        title: 'Acompanhar prazo recursal',
        description: 'Verificar prazos para eventual recurso',
        priority: 'ALTA',
        dueDate: new Date('2024-01-30'),
        assignedId: advogado2.id,
        createdById: admin.id,
        processId: processo2.id,
      },
    ],
  });

  console.log('✅ Tarefas criadas');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📋 Dados criados:');
  console.log('👤 Usuários:');
  console.log('   Admin: admin@plataformagestao.com (senha: Admin123!)');
  console.log('   Advogado 1: joao.silva@escritorio.com (senha: Advogado123!)');
  console.log('   Advogado 2: maria.santos@escritorio.com (senha: Advogado123!)');
  console.log('   Assistente: ana.oliveira@escritorio.com (senha: Assistente123!)');
  console.log('\n🏢 3 Clientes criados');
  console.log('⚖️ 3 Processos criados');
  console.log('📋 3 Tarefas criadas');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 