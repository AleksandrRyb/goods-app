import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.productsRepository.findOne({
      where: { article: createProductDto.article },
      select: ['id'], 
    });

    if (existingProduct) {
      throw new ConflictException(
        `Товар с артикулом "${createProductDto.article}" уже существует`,
      );
    }

    const product = this.productsRepository.create(createProductDto);
    return await this.productsRepository.save(product);
  }

  async findAll(
    page: number = 1,
    limit: number = 50,
  ): Promise<{ data: Product[]; total: number }> {
    const skip = (page - 1) * limit;

    // Используем индекс createdAt для быстрой сортировки
    // findAndCount выполняет 2 оптимизированных запроса параллельно
    const [data, total] = await this.productsRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.dataSource.transaction(async (manager) => {
      const productRepo = manager.getRepository(Product);
      
      const product = await productRepo.findOne({ where: { id } });
      
      if (!product) {
        throw new NotFoundException(`Товар с ID ${id} не найден`);
      }

      if (updateProductDto.article && updateProductDto.article !== product.article) {
        const existingProduct = await productRepo.findOne({
          where: { article: updateProductDto.article },
          select: ['id'],
        });

        if (existingProduct) {
          throw new ConflictException(
            `Товар с артикулом "${updateProductDto.article}" уже существует`,
          );
        }
      }

      Object.assign(product, updateProductDto);
      return await productRepo.save(product);
    });
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }
}

