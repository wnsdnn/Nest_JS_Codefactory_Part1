import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';

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
  getPost(@Param('id') id: string) {
    return this.postsService.getPostById(+id);
  }

  // 3) POST /posts
  // POST를 생성한다.
  @Post()
  postPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.createPost(author, title, content);
  }

  // 4) PATCH /posts/:id
  // id에 해당되는 POST를 변경한다.
  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(+id, author, title, content);
  }

  // 5) DELETE /posts/:id
  // id에 해당되는 POST를 삭제한다.
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    this.postsService.deletePost(+id);
  }
}