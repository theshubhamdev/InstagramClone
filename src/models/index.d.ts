import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type CommentMetaData = {
  readOnlyFields: 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type PostMetaData = {
  readOnlyFields: 'updatedAt';
}

type LikeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Comment {
  readonly id: string;
  readonly createdAt: string;
  readonly comment: string;
  readonly User?: User | null;
  readonly Post?: Post | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Comment, CommentMetaData>);
  static copyOf(source: Comment, mutator: (draft: MutableModel<Comment, CommentMetaData>) => MutableModel<Comment, CommentMetaData> | void): Comment;
}

export declare class User {
  readonly id: string;
  readonly name: string;
  readonly email?: string | null;
  readonly username?: string | null;
  readonly bio?: string | null;
  readonly website?: string | null;
  readonly nofPosts: number;
  readonly nofFollowers: number;
  readonly nofFollowings: number;
  readonly image?: string | null;
  readonly Posts?: (Post | null)[] | null;
  readonly Comments?: (Comment | null)[] | null;
  readonly Likes?: (Like | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

export declare class Post {
  readonly id: string;
  readonly createdAt: string;
  readonly type: string;
  readonly description?: string | null;
  readonly location?: string | null;
  readonly image?: string | null;
  readonly images?: string[] | null;
  readonly video?: string | null;
  readonly nofComments: number;
  readonly nofLikes: number;
  readonly User?: User | null;
  readonly Likes?: (Like | null)[] | null;
  readonly Comments?: (Comment | null)[] | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Post, PostMetaData>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post, PostMetaData>) => MutableModel<Post, PostMetaData> | void): Post;
}

export declare class Like {
  readonly id: string;
  readonly User?: User | null;
  readonly Post?: Post | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Like, LikeMetaData>);
  static copyOf(source: Like, mutator: (draft: MutableModel<Like, LikeMetaData>) => MutableModel<Like, LikeMetaData> | void): Like;
}