import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserModel } from './entity/user.entity';
import {
  Between,
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}

  @Post('sample')
  async sample() {
    // 모델에 해당되는 객체 생성 - 저장은 안함
    // const user1 = this.userRepository.create({
    //   email: 'test@codefactory.ai',
    // });

    // 저장
    // const user2 = await this.userRepository.save({
    //   email: 'test@codefactory.ai',
    // });

    // preload
    // 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고
    // 추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체함.
    // 저장하지는 않음
    // const user3 = await this.userRepository.preload({
    //   id: 101,
    //   email: 'codefactory@codefactory.ai',
    // });

    // 삭제하기
    // await this.userRepository.delete(101);

    // 특정 컬럼의 값을 원하는 값만큼 증가시킬수 있다.
    // await this.userRepository.increment(
    //   {
    //     id: 1,
    //   },
    //   'count',
    //   2,
    // );

    // increment와 반대개념 (값을 감소시킴)
    // await this.userRepository.decrement(
    //   {
    //     id: 1,
    //   },
    //   'count',
    //   1,
    // );

    // 갯수 카운팅하기
    // const count = await this.userRepository.count({
    //   where: {
    //     email: ILike('%0%'),
    //   },
    // });

    // sum (합계)
    // const sum = await this.userRepository.sum('count', {
    //   email: ILike('%0%'),
    // });

    // average (평균)
    // const average = await this.userRepository.average('count', {
    //   id: LessThan(4),
    // });

    // 최소값
    // const min = await this.userRepository.minimum('count', {
    //   id: LessThan(4),
    // });

    // 최대값
    // const max = await this.userRepository.maximum('count', {
    //   id: LessThan(4),
    // });

    // const users = await this.userRepository.find({
    //
    // });

    // 조건에 맞는값이 여러개 있어도 젤 처음에 1번째 값만 가져옴
    // const userOne = await this.userRepository.findOne({
    //   where: {
    //     id: 3,
    //   },
    // });

    // 조건에 맞는값들 + 조건을 안걸었을때 나올 값들의 개수를 반환
    const userAndCount = await this.userRepository.findAndCount({
      take: 3,
    });

    return userAndCount;
  }

  @Post('users')
  async postUser() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@google.com`,
      });
    }
    // return this.userRepository.save({
    //   email: '1234@gmail.com',
    //   // title: 'test title',
    //   // role: 'another role',
    // });
  }

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      // 오름차순, 내림차순
      // ASC -> 오름차순
      // DESC -> 내림차순
      order: {
        id: 'asc',
      },
      // 필터링할 조건을 입력하게된다. (AND 조건)
      where: {
        // Not() - 아닌경우 가져오기
        // id: Not(1),
        // LessThan() - 적은경우 가져오기
        // id: LessThan(30),
        // LessThanOrEqual() - 적은경우 or 같은경우
        // id: LessThanOrEqual(30),
        // MoreThan() - 많은경우
        // id: MoreThan(30),
        // MoreThanOrEqual() - 많거나 같은경우
        // id: MoreThanOrEqual(30),
        // Equal() - 같은경우
        // id: Equal(30),
        // Like() - 유사값
        // email: Like('%0%'),
        // ILike() - 대문자 소문자 구분안하는 유사값
        // email: ILike('%GOOGLE%'),
        //Between() - 사이값
        // id: Between(10, 15),
        // In() - 해당되는 여러개의 값
        // id: In([1, 3, 5, 7, 99]),
        // IsNull() - null인 경우
        // id: IsNull(),
      },
      // 어떤 프로퍼티를 선택할지
      // 기본은 모든 프로퍼티를 가져온다
      // 만약에 select를 정의하지 않으면
      //
      // select를 정의하면 정의된 프로퍼티들만 가져오게된다.
      // select: {
      //   id: true,
      //   createdAt: true,
      //   updatedAt: true,
      //   version: true,
      //   profile: {
      //     id: true,
      //     id: true,
      //   },
      // },
      // 리스트로 값을 넣을시 OR조건으로 변경된다.
      // where: [
      //   {
      //     id: 3,
      //   },
      //   {
      //     version: 1,
      //   },
      // ],
      // 관계를 가져오는법
      // relations에 선언한 프로퍼티는
      // select나 where에서 사용할수 있음
      // relations: {
      //   profile: true,
      // },
      // 처음 몇개를 제외할지 (default: 0),
      // skip: 0,
      // 몇개를 가져올지 (default: 0[테이블 전체 행의 개수])
      // take: 1,
    });
  }

  @Patch('users/:id')
  async patchUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });

    return this.userRepository.save({
      ...user,
      email: user.email + '0',
      // title: user.title + '0',
    });
  }

  @Delete('user/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'asdf@codefactory.ai',
      profile: {
        profileImg: 'asdf.jpg',
      },
    });

    // const profile = await this.profileRepository.save({
    //   profileImg: 'asdf.jpg',
    //   user: user,
    // });

    return user;
  }

  @Post('user/post')
  async createUserAndPosts() {
    const user = await this.userRepository.save({
      email: 'postuser@codefactory.ai',
    });

    await this.postRepository.save({
      title: 'post1',
      author: user,
    });

    await this.postRepository.save({
      title: 'post2',
      author: user,
    });

    return user;
  }

  @Post('posts/tags')
  async createPostsTags() {
    const post1 = await this.postRepository.save({
      title: 'NestJS Lecture',
    });

    const post2 = await this.postRepository.save({
      title: 'Programming Lecture',
    });

    const tag1 = await this.tagRepository.save({
      name: 'JavaScript',
      posts: [post1, post2],
    });

    const tag2 = await this.tagRepository.save({
      name: 'TypeScript',
      posts: [post1],
    });

    const post3 = await this.postRepository.save({
      title: 'NextJS Lecture',
      tags: [tag1, tag2],
    });
  }

  @Get('posts')
  getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Get('tags')
  getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }
}
