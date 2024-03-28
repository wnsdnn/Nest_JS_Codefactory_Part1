import { ValidationArguments } from 'class-validator';

// validation 함수들 일반화 시킨 함수들이 있는 파일들
export const lengthValidationMessage = (args: ValidationArguments) => {
  /**
   * ValidationArguments의 프로퍼티들
   *
   * 1) value -> 검증 되고 있는 값 (입력된 값)
   * 2) constraints -> 파라미터에 입력된 제한 사항들
   * (검증할려는 제약사항들) Length의 경우 현재 min: 1, max: 20 값들
   * args.constraints[0] -> 1
   * args.constraints[1] -> 20
   * 3) targetName -> 검증하고 있는 클래스의 이름
   * 4) object -> 검증하고 있는 객체
   * 5) property -> 검증 되고 있는 객체의 프로퍼티 이름
   */

  if (args.constraints.length === 2) {
    return `${args.property}은 ${args.constraints[0]}~${args.constraints[1]} 글자를 입력해주세요!`;
  } else {
    return `${args.property}은 최소 ${args.constraints[0]}글자를 입력해주세요!`;
  }
};
