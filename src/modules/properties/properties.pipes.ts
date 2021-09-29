// import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

// @Injectable()
// export class PropertiesvalidationPipe implements PipeTransform{
//     constructor(private schema:Object){}
//     transform(value: any, metadata: ArgumentMetadata) {
//         const { error } = this.schema.validation(value);
//         if (error) {
//           throw new BadRequestException('Validation failed');
//         }
//         return value

// }