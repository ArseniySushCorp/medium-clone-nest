import { isEmpty } from "ramda"
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
  ValidationError
} from "@nestjs/common"
import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import { BackendValidationErrors } from "@app/types/BackendValidationErrors.type"

export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, metodata: ArgumentMetadata) {
    const object = plainToClass(metodata.metatype, value)

    if (typeof object !== "object") {
      return value
    }

    const errors = await validate(object)

    if (isEmpty(errors)) {
      return value
    }

    throw new HttpException({ errors: this.formatErrors(errors) }, HttpStatus.UNPROCESSABLE_ENTITY)
  }

  private formatErrors(errors: ValidationError[]): BackendValidationErrors {
    return errors.reduce((acc, error) => {
      acc[error.property] = Object.values(error.constraints)
      return acc
    }, {})
  }
}
