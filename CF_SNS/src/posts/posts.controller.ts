import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from '../auth/guard/bearer-token.guard';
import { request } from 'express';

@Controller('posts')
export class PostsController {
  // private readonly => this.postService(해당 클래스에 멤버변수) = postsService;
  // 해당 코드와 같은 의미
  // Nest JS에 기본적인 아키택처 구조 때문에 Controller가 있단 소린 Service가 반드시
  // 존재하기 때문에 Controller 파일을 생성하면 Service를 자동으로 연결해준다.
  constructor(private readonly postsService: PostsService) {}

  // 1) GET / posts
  // 모든 post를 다 가져온다.
  @Get('')
  getPosts() {
    return this.postsService.getAllPosts();
  }

  // 2) GET /posts/:id
  // id에 해당되는 post를 가져온다.
  // 예를 들어 id: 1인경구 id가 1인 포스트를 가져온다.
  @Get(':id')
  // @Params([value])안에 선언한 값(value)으로 url의 있는 값과 같은 이름의 값을 가져올수 있음
  //
  // ParseIntPipe를 써서 id를 number값으로 취급
  // Pipe에서 number로 바꿀수 없는 값이 들어왔을땐 Pipe에서 에러도 발생시켜줌
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  // 3) POST /posts
  // POST를 생성한다.
  @Post()
  // AccessToken값이 존재하는지 확인
  @UseGuards(AccessTokenGuard)
  postPost(
    // AccessTokenGuard를 사용해서 request에 user 데이터를 저장.
    @Request() req: any,
    @Body('title') title: string,
    @Body('content') content: string,
    // isPublic 값을 보내주지 않는다면 기본값을 true로 설정
    // @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
  ) {
    // request의 user 데이터를 가져와서 글 저장 API에 적용
    const authorId = req.user.id;

    return this.postsService.createPost(authorId, title, content);
  }

  // 4) PATCH /posts/:id
  // id에 해당되는 POST를 변경한다.
  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(id, title, content);
  }

  // 5) DELETE /posts/:id
  // id에 해당되는 POST를 삭제한다.
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    this.postsService.deletePost(id);
  }
}
