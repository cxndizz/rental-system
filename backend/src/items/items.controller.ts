import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto, UpdateItemDto, CreateCategoryDto, CreateTagDto } from './dto';

@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  // Items
  @Get()
  getAllItems(@Query() query: any) {
    return this.itemsService.getAllItems(query);
  }

  @Get(':id')
  getItem(@Param('id') id: string) {
    return this.itemsService.getItem(+id);
  }

  @Post()
  createItem(@Body() dto: CreateItemDto) {
    return this.itemsService.createItem(dto);
  }

  @Put(':id')
  updateItem(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.itemsService.updateItem(+id, dto);
  }

  @Delete(':id')
  deleteItem(@Param('id') id: string) {
    return this.itemsService.deleteItem(+id);
  }

  // Categories
  @Get('categories/all')
  getCategories() {
    return this.itemsService.getCategories();
  }

  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.itemsService.createCategory(dto);
  }

  // Tags
  @Get('tags/all')
  getTags() {
    return this.itemsService.getTags();
  }

  @Post('tags')
  createTag(@Body() dto: CreateTagDto) {
    return this.itemsService.createTag(dto);
  }

  // Media
  @Post(':id/media')
  addMedia(@Param('id') id: string, @Body() dto: any) {
    return this.itemsService.addMedia(+id, dto);
  }
}
