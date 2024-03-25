import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
// 기본으로 모든 Pip는 PipeTransform을 implements
export class PasswordPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    const strValue = value.toString();

    if (strValue.length > 8) {
      throw new BadRequestException('비밀번호는 8자 이하로 입력해주세요!');
    }

    return strValue;
  }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(
    private readonly length: number,
    private readonly subject: string,
  ) {}

  transform(value: any, metadata: ArgumentMetadata): any {
    if (value.toString().length > this.length) {
      throw new BadRequestException(
        `${this.subject}의 최대 길이는 ${this.length}입니다.`,
      );
    }

    return value.toString();
  }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(private readonly length: number) {}

  transform(value: any, metadata: ArgumentMetadata): any {
    if (value.toString().length < this.length) {
      throw new BadRequestException(`최소 길이는 ${this.length}입니다.`);
    }

    return value.toString();
  }
}
