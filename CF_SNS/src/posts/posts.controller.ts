import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { User } from '../users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post-dto';
import { UsersModel } from '../users/entity/users.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageModelType } from '../common/entity/iamge.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { PostsImagesService } from './image/images.service';
import { TransactionInterceptor } from '../common/interceptor/transaction.interceptor';
import { QueryRunnerDecorator } from '../common/decorator/query-runnder.decorator';
import { Roles } from '../users/decorator/roles.decorator';
import { RolesEnum } from '../users/entity/const/foles.const';
import { IsPublic } from '../common/decorator/is-public.decorator';
import { IsPostMineOrAdminGuard } from './guard/is-post-mine-or-admin.guard';

@Controller('posts')
export class PostsController {
  // private readonly => this.postService(해당 클래스에 멤버변수) = postsService;
  // 해당 코드와 같은 의미
  // Nest JS에 기본적인 아키택처 구조 때문에 Controller가 있단 소린 Service가 반드시
  // 존재하기 때문에 Controller 파일을 생성하면 Service를 자동으로 연결해준다.
  constructor(
    private readonly postsService: PostsService,
    // DataSource - nest에서 기본제공
    private readonly dataSource: DataSource,
    private readonly postsImagesService: PostsImagesService,
  ) {}

  // 1) GET / posts
  // 모든 post를 다 가져온다.
  @Get('')
  @IsPublic()
  // @UseInterceptors(LogInterceptor)
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  // POST /posts/random
  @Post('random')
  async postPostsRandom(@User() user: UsersModel) {
    await this.postsService.generatePosts(user.id);

    return true;
  }

  // 2) GET /posts/:id
  // id에 해당되는 post를 가져온다.
  // 예를 들어 id: 1인경구 id가 1인 포스트를 가져온다.
  @Get(':id')
  @IsPublic()
  // @Params([value])안에 선언한 값(value)으로 url의 있는 값과 같은 이름의 값을 가져올수 있음
  //
  // ParseIntPipe를 써서 id를 number값으로 취급
  // Pipe에서 number로 바꿀수 없는 값이 들어왔을땐 Pipe에서 에러도 발생시켜줌
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  // 3) POST /posts
  // POST를 생성한다.
  // DTO - Data Trasfer Object
  //
  // Transaction (트랜젝션)
  // all or nothing 이라고 함 (모두가 실행되거나 아무것도 실행이 안되거나)
  // start -> 시작
  // commit(성공했을때) -> 저장 (쌓아뒀다가 한번에 저장)
  // rollback -> 원상복구 (오류나면 rollback 실행)
  @Post()
  // AccessToken값이 존재하는지 확인
  @UseInterceptors(FileInterceptor('image'))
  @UseInterceptors(TransactionInterceptor)
  async postPost(
    @User('id', ParseIntPipe) userId: number,
    @Body() body: CreatePostDto,
    @QueryRunnerDecorator() qr: QueryRunner,
  ) {
    const post = await this.postsService.createPost(userId, body, qr);

    for (let i = 0; i < body.images.length; i++) {
      await this.postsImagesService.createPostImage(
        {
          post,
          order: i,
          path: body.images[i],
          type: ImageModelType.POST_IMAGE,
        },
        qr,
      );
    }

    return this.postsService.getPostById(post.id, qr);
  }

  // 4) PATCH /posts/:id
  // id에 해당되는 POST를 변경한다.
  @Patch(':postId')
  @UseGuards(IsPostMineOrAdminGuard)
  patchPost(
    @Param('postId', ParseIntPipe) id: number,
    // @Body('title') title?: st ring,
    // @Body('content') content?: string,
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, body);
  }

  // 5) DELETE /posts/:id
  // id에 해당되는 POST를 삭제한다.
  @Delete(':id')
  // 역할 기반 접근 제어
  // RBACK -> Role Based Access Control
  @Roles(RolesEnum.ADMIN)
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
