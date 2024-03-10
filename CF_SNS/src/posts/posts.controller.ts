import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';

/**
 * author: string;
 * title: string;
 * content: string;
 * likeCount: number;
 * commentCount: number;
 */
interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: 'newjeans_official',
    title: '뉴진스 민지',
    content: '메이크업 고치고 있는 민지',
    likeCount: 1000000,
    commentCount: 999999,
  },
  {
    id: 2,
    author: 'newjeans_official',
    title: '뉴진스 해린',
    content: '노래 연습 하고 있는 해린',
    likeCount: 1000000,
    commentCount: 999999,
  },
  {
    id: 3,
    author: 'blackpink_official',
    title: '블랙핑크 로제',
    content: '종합운동자에서 공연중인 로제',
    likeCount: 1000000,
    commentCount: 999999,
  },
];

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
    return posts;
  }

  // 2) GET /posts/:id
  // id에 해당되는 post를 가져온다.
  // 예를 들어 id: 1인경구 id가 1인 포스트를 가져온다.
  @Get(':id')
  // @Params([value])안에 선언한 값(value)으로 url의 있는 값과 같은 이름의 값을 가져올수 있음
  getPost(@Param('id') id: string) {
    const post = posts.find((post) => post.id === +id);

    if (!post) {
      // 없으면 NotFound 에러 반환
      throw new NotFoundException();
    }

    return post;
  }

  // 3) POST /posts
  // POST를 생성한다.
  @Post()
  postPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    if (!author || !title || !content) {
      throw new BadRequestException();
    }

    const post: PostModel = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };

    posts.push(post);

    return post;
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
    const post = posts.find((post) => post.id === +id);

    if (!post) {
      throw new NotFoundException();
    }

    if (author) {
      post.author = author;
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    posts = posts.map((prevPost) => (prevPost.id === +id ? post : prevPost));

    return post;
  }

  // 5) DELETE /posts/:id
  // id에 해당되는 POST를 삭제한다.
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    const post = posts.find((post) => post.id === +id);

    if (!post) {
      throw new NotFoundException();
    }

    posts = posts.filter((post) => post.id !== +id);

    return id;
  }
}
