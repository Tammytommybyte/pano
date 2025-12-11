import { db } from './index'
import { users, vendors, events, products, customers, priceLists, priceListItems, systemSettings } from './schema'
import * as bcrypt from 'bcryptjs'

/**
 * Seed the database with initial data
 */
async function seed() {
  console.log('🌱 Seeding database...')

  try {
    // Seed system settings
    console.log('Creating system settings...')
    await db.insert(systemSettings).values([
      {
        settingKey: 'default_commission_percentage',
        settingValue: '10.00',
        valueType: 'number',
        category: 'commissions',
        description: 'Default commission percentage for vendors',
        isPublic: false,
      },
      {
        settingKey: 'default_deposit_percentage',
        settingValue: '50.00',
        valueType: 'number',
        category: 'payments',
        description: 'Default deposit percentage for orders',
        isPublic: true,
      },
      {
        settingKey: 'low_stock_threshold',
        settingValue: '10',
        valueType: 'number',
        category: 'inventory',
        description: 'Low stock alert threshold',
        isPublic: false,
      },
      {
        settingKey: 'enable_online_payments',
        settingValue: 'true',
        valueType: 'boolean',
        category: 'payments',
        description: 'Enable online payment processing',
        isPublic: true,
      },
    ])

    // Seed admin user
    console.log('Creating admin user...')
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const [adminUser] = await db.insert(users).values({
      email: 'admin@eureka.com',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '1234567890',
      role: 'admin',
      isActive: true,
    }).$returningId()

    // Seed vendor user
    console.log('Creating vendor user...')
    const vendorPassword = await bcrypt.hash('vendor123', 10)
    const [vendorUser] = await db.insert(users).values({
      email: 'vendor@eureka.com',
      passwordHash: vendorPassword,
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '9876543210',
      role: 'vendor',
      isActive: true,
    }).$returningId()

    // Seed vendor
    console.log('Creating vendor...')
    const [vendor] = await db.insert(vendors).values({
      userId: vendorUser.id,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'vendor@eureka.com',
      phone: '9876543210',
      commissionPercentage: '10.00',
      totalSales: '0.00',
      totalCommissions: '0.00',
      status: 'active',
    }).$returningId()

    // Seed products
    console.log('Creating products...')
    const productsData = [
      {
        productCode: 'PKG-BASIC-001',
        productName: 'Paquete Básico Graduación',
        category: 'package',
        description: 'Incluye diploma, carpeta y foto 5x7',
        basePrice: '1500.00',
        cost: '800.00',
        margin: '46.67',
        productionTime: 7,
        productionArea: 'assembly',
        reorderPoint: 10,
        isActive: true,
      },
      {
        productCode: 'DIP-GOLD-001',
        productName: 'Diploma Marco Dorado',
        category: 'diploma',
        description: 'Diploma con marco dorado premium',
        basePrice: '500.00',
        cost: '250.00',
        margin: '50.00',
        productionTime: 3,
        productionArea: 'engraving',
        reorderPoint: 15,
        isActive: true,
      },
      {
        productCode: 'RING-GOLD-001',
        productName: 'Anillo Graduación Oro',
        category: 'ring',
        description: 'Anillo de graduación en oro 10k',
        basePrice: '2500.00',
        cost: '1500.00',
        margin: '40.00',
        productionTime: 14,
        productionArea: 'rings',
        reorderPoint: 5,
        isActive: true,
      },
      {
        productCode: 'PHOTO-8X10-001',
        productName: 'Fotografía 8x10',
        category: 'photo',
        description: 'Fotografía profesional 8x10',
        basePrice: '300.00',
        cost: '100.00',
        margin: '66.67',
        productionTime: 2,
        productionArea: 'atc',
        reorderPoint: 20,
        isActive: true,
      },
    ]

    const insertedProducts = await db.insert(products).values(productsData).$returningId()

    // Seed price list
    console.log('Creating price list...')
    const [priceList] = await db.insert(priceLists).values({
      priceListName: 'ULA 2025 - Licenciatura Mayo',
      description: 'Lista de precios para graduación ULA Mayo 2025',
      validFrom: new Date('2025-01-01'),
      validTo: new Date('2025-06-30'),
      isActive: true,
    }).$returningId()

    // Seed price list items
    console.log('Creating price list items...')
    const priceListItemsData = insertedProducts.map((product, index) => ({
      priceListId: priceList.id,
      productId: product.id,
      price: productsData[index].basePrice,
      discount: '0.00',
    }))
    await db.insert(priceListItems).values(priceListItemsData)

    // Seed event
    console.log('Creating event...')
    await db.insert(events).values({
      eventCode: 'ULA-2025-LIC-MAYO',
      eventName: 'Graduación ULA Licenciatura Mayo 2025',
      university: 'Universidad de Los Andes',
      campus: 'Campus Principal',
      eventDate: new Date('2025-05-15'),
      priceListId: priceList.id,
      vendorId: vendor.id,
      status: 'active',
      totalBudget: '500000.00',
      totalSales: '0.00',
      eventLocation: 'Auditorio Principal ULA',
      eventCapacity: 500,
      registrationDeadline: new Date('2025-04-30'),
      deliveryDate: new Date('2025-05-14'),
      allowsOnlinePayment: true,
      requiresDeposit: true,
      depositPercentage: '50.00',
    })

    // Seed sample customers
    console.log('Creating sample customers...')
    await db.insert(customers).values([
      {
        firstName: 'María',
        lastName1: 'González',
        lastName2: 'Rodríguez',
        email: 'maria.gonzalez@example.com',
        phone: '1111111111',
        generation: '2025',
        university: 'Universidad de Los Andes',
        campus: 'Campus Principal',
        major: 'Ingeniería de Sistemas',
        deliveryConfirmed: false,
      },
      {
        firstName: 'Carlos',
        lastName1: 'Martínez',
        lastName2: 'López',
        email: 'carlos.martinez@example.com',
        phone: '2222222222',
        generation: '2025',
        university: 'Universidad de Los Andes',
        campus: 'Campus Principal',
        major: 'Administración',
        deliveryConfirmed: false,
      },
    ])

    console.log('✅ Database seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seed completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seed failed:', error)
      process.exit(1)
    })
}

export { seed }
