import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class ProductsService {
    
    private readonly logger = new Logger('ProductsService')

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly eventsService: EventsService // Replace MealsWsService with this
        // private readonly mealsWsService: MealsWsService // Inject WebSocket service
    ){}

    async findAll( paginationDto: PaginationDto ){

        const { limit = 10, offset = 0 } = paginationDto;

        try {
            const products = await this.productRepository.find({
                take: limit,
                skip: offset,
                order: { id: 'DESC' }
            });
    
            return products;
            
        } catch ( error ) {
            this.handleDBExceptions( error )
        }
    }
    
    async totalProducts(){

        try {
            const total = await this.productRepository.count();
    
            return total;
            
        } catch ( error ) {
            this.handleDBExceptions( error )
        }
    }

    async findOne( id: number ) {

        const product = await this.productRepository.findOneBy({ id });
        if ( !product )
            throw new NotFoundException(`Product with id ${ id } not found`);

        return product;
    }

    async create( createProductDto: CreateProductDto ) {

        try {
            
            const product = this.productRepository.create( createProductDto );
            await this.productRepository.save( product );

            // Broadcast new product to all connected clients
            // Update your broadcast calls to use:
            this.eventsService.broadcast('item-created', product);
            // Instead of mealsWsService.broadcastUpdate()
            // this.mealsWsService.broadcastUpdate('item-created', product);

            return product;

        } catch ( error ) {
          this.handleDBExceptions( error )
        }

    }

    async update( id: number, updateProductDto: UpdateProductDto ) {

        const product = await this.productRepository.preload({
            id: id,
            ...updateProductDto
        })

        if ( !product ) 
            throw new NotFoundException(`Product with id: ${ id } not found.`);

        try {
            await this.productRepository.save( product );

            // Broadcast updated product
            // this.mealsWsService.broadcastProductUpdate('updated', product);
            // Broadcast updated product using eventsService
            this.eventsService.broadcast('item-updated', product);

            return product;
            
        } catch (error) {
            this.handleDBExceptions( error );
        }


    }

    async remove( id: number ) {
        const product = await this.findOne( id )
        await this.productRepository.remove( product );

        // Broadcast deletion
        // this.mealsWsService.broadcastProductUpdate('deleted', { id });

    }

    private handleDBExceptions( error: any ){
          
        if ( error.code === '23505' ){
            if ( `${error.detail}`.substring(0,10) === "Key (name)" )
                throw new BadRequestException('Product name already exists');
            
            throw new BadRequestException(error.detail);
        }

        this.logger.error(error)
        throw new InternalServerErrorException('Unexpected error, check server logs');

    }

}
