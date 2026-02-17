import { Controller, Get } from '@nestjs/common';
import { ProductTypeFactoryService } from './product-type-factory.service';
import { ProductVariant } from './product-variant';

@Controller('flyweight')
export class FlyweightController {
  constructor(
    private readonly productTypeFactory: ProductTypeFactoryService,
  ) {}

  @Get('products')
  getProducts() {
    const variants: ProductVariant[] = [];

    // T-Shirt: 1 flyweight shared across many variants
    const tshirtType = this.productTypeFactory.getProductType(
      'T-Shirt',
      'Premium cotton t-shirt',
      29.99,
      'Clothing',
    );

    const tshirtColors = ['Red', 'Blue', 'Black', 'White'];
    const tshirtSizes = ['S', 'M', 'L', 'XL'];

    for (const color of tshirtColors) {
      for (const size of tshirtSizes) {
        variants.push(
          new ProductVariant(
            `TSH-${color.toUpperCase()}-${size}`,
            color,
            size,
            tshirtType,
          ),
        );
      }
    }

    // Sneaker: another shared flyweight
    const sneakerType = this.productTypeFactory.getProductType(
      'Sneaker',
      'Lightweight running sneaker',
      89.99,
      'Footwear',
    );

    const sneakerColors = ['White', 'Black', 'Grey'];
    const sneakerSizes = ['8', '9', '10', '11', '12'];

    for (const color of sneakerColors) {
      for (const size of sneakerSizes) {
        variants.push(
          new ProductVariant(
            `SNK-${color.toUpperCase()}-${size}`,
            color,
            size,
            sneakerType,
          ),
        );
      }
    }

    // Laptop: another shared flyweight
    const laptopType = this.productTypeFactory.getProductType(
      'Laptop',
      'High-performance laptop',
      1299.99,
      'Electronics',
    );

    const laptopColors = ['Silver', 'Space Grey'];
    const laptopSizes = ['13"', '15"', '17"'];

    for (const color of laptopColors) {
      for (const size of laptopSizes) {
        variants.push(
          new ProductVariant(
            `LPT-${color.replace(' ', '').toUpperCase()}-${size.replace('"', '')}`,
            color,
            size,
            laptopType,
          ),
        );
      }
    }

    const uniqueTypes = this.productTypeFactory.getTypeCount();
    const totalVariants = variants.length;

    // Without flyweight: each variant stores its own copy of the type data
    // With flyweight: type data is shared across all variants of the same type
    const bytesPerTypeObject = 200; // approximate bytes for type properties
    const memorySaved = `~${((totalVariants - uniqueTypes) * bytesPerTypeObject / 1024).toFixed(1)}KB saved by sharing ${uniqueTypes} type objects across ${totalVariants} variants`;

    return {
      variants: variants.map((v) => v.getDetails()),
      uniqueTypes,
      totalVariants,
      memorySaved,
    };
  }
}
