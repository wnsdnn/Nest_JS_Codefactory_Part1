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
