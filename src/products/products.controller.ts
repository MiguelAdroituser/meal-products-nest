import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    
    constructor(
       private readonly productsService: ProductsService
    ){}
    
    @Post()
    @ApiResponse({ status: 201, description: 'Product was created' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
    @UseGuards( AuthGuard() )    
    create( @Body() createProductDto: CreateProductDto ) {
        return this.productsService.create( createProductDto );
    }

    @Get()
    findAll( @Query() paginationDto: PaginationDto ) {
        
        return this.productsService.findAll( paginationDto );
    }

    @Get('/total')
    totalProducts() {
        
        return this.productsService.totalProducts();
    }

    @Get(':id')
    findOne( @Param('id', ParseIntPipe ) id: number ) {
        return this.productsService.findOne( id );
    }
    
    @Patch(':id')
    @UseGuards( AuthGuard() )
    update(
        @Param('id', ParseIntPipe ) id: number, 
        @Body() updateProductDto: UpdateProductDto 
    ) {
        return this.productsService.update( id, updateProductDto )
    }

    @Delete(':id')
    @UseGuards( AuthGuard() )
    remove( @Param('id', ParseIntPipe) id: number ) {
        return this.productsService.remove( id );
    }

}
