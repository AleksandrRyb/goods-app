import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    const count = await this.productsRepository.count();
    
    if (count === 0) {
      console.log('🌱 Seeding database with test data...');
      await this.seedProducts();
      console.log('✅ Database seeded successfully!');
    }
  }

  private async seedProducts() {
    const products = [
      { article: 'NB-001', name: 'Хлеб белый', price: 899, quantity: 5 },
      { article: 'NB-002', name: 'Молоко 3.2%', price: 7500, quantity: 20 },
      { article: 'NB-003', name: 'Сыр Российский', price: 45000, quantity: 12 },
      { article: 'NB-004', name: 'Масло сливочное', price: 25000, quantity: 8 },
      { article: 'NB-005', name: 'Яйца куриные (10 шт)', price: 12000, quantity: 30 },
      { article: 'NB-006', name: 'Сахар-песок 1кг', price: 8500, quantity: 15 },
      { article: 'NB-007', name: 'Мука пшеничная 1кг', price: 5500, quantity: 25 },
      { article: 'NB-008', name: 'Рис круглозерный 1кг', price: 9500, quantity: 18 },
      { article: 'NB-009', name: 'Гречка ядрица 1кг', price: 11000, quantity: 22 },
      { article: 'NB-010', name: 'Макароны спагетти', price: 6500, quantity: 35 },
      { article: 'NB-011', name: 'Подсолнечное масло 1л', price: 15000, quantity: 14 },
      { article: 'NB-012', name: 'Соль поваренная 1кг', price: 2500, quantity: 40 },
      { article: 'NB-013', name: 'Чай черный 100г', price: 12500, quantity: 10 },
      { article: 'NB-014', name: 'Кофе растворимый 100г', price: 35000, quantity: 8 },
      { article: 'NB-015', name: 'Сахар ванильный', price: 1500, quantity: 50 },
    ];

    await this.productsRepository.insert(products);
  }
}

