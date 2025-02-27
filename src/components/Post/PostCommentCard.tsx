/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToggleDisLikeOnCommentMutation, useToggleLikeOnCommentMutation } from '@/redux/features/api/postApi';
import { useAppSelector } from '@/redux/hooks';
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import toast from 'react-hot-toast';


interface IUser {
    id: any;
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    profileImage?: string;
    coverImage?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    followers?: any[];
    role: any;
    refreshToken?: string;
    posts: any[];
    comments: any
}

export interface IPost {
    id: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
    authorId: string;
    author: IUser;
    image?: string;
    likers?: string[];
    comments?: Comment[];
    topicId?: string;
    topic?: any;
}

export interface IComment {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    author: IUser;
    postId: string;
    post: IPost;
    likers: string[];
    dislikers: string[];
    likeCount: number;
    dislikeCount: number;
}

const PostCommentCard = ({ comment }: { comment: IComment }) => {
    const user = useAppSelector((state) => state.auth.user);
    const [ toggleCommentLike, { isLoading: toggleCommentLikeLoading } ] = useToggleLikeOnCommentMutation();
    const [ toggleCommentDisLike, { isLoading: toggleCommentDisLikeLoading } ] = useToggleDisLikeOnCommentMutation();
    

    const handleToggleCommentLike = async (mode: "like" | "disLike", commentId: string) => {
        if (!user) {
            toast.error("Please Login first!")
            return;
        }
        try {
            const authorId = user.id;
            const id = commentId;
            if (mode === "like") {
                const response = await toggleCommentLike(
                    {
                        authorId,
                        id
                    }
                )
            }
            if (mode === "disLike") {
                const response = await toggleCommentDisLike(
                    {
                        authorId,
                        id
                    }
                )
            }

        } catch (error) {
        }

    }


    return (
        <div key={comment.id} className="flex items-start gap-3 bg-gray-700 p-3 rounded-lg">
            {/* Profile Image */}
            {comment?.author?.profileImage ? (
                <Image
                    width={500}
                    height={500}
                    src={comment?.author?.profileImage}
                    alt="profile image"
                    className="w-10 h-10 rounded-full"
                />
            ) : (
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-lg font-bold">{comment?.author?.firstName?.[ 0 ]}</span>
                </div>
            )}

            {/* Comment Content */}
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="font-semibold">{comment?.author?.firstName}</p>
                    <span className="text-xs text-gray-400">
                        {new Date(comment?.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
                <p className="text-sm text-gray-300 mt-1">{comment?.content}</p>

                {/* Like and Dislike Buttons (For Future Implementation) */}
                <div className="flex items-center gap-4 mt-2 text-gray-400">
                    <button
                        onClick={() => handleToggleCommentLike("like", comment?.id)}
                        className="flex items-center gap-1 hover:text-gray-200">
                        <ThumbsUp fill={comment?.likers.includes(user?.id) ? "blue" : ""}
                            className={`w-5 h-5 transform transition-transform duration-200 ${toggleCommentLikeLoading ? "scale-125" : ""
                                }`} />
                        <span className="font-bold text-sm">{comment?.likeCount}</span>
                    </button>
                    <button onClick={() => handleToggleCommentLike("disLike", comment?.id)} className="flex items-center gap-1 hover:text-gray-200">
                        <ThumbsDown fill={comment?.dislikers?.includes(user?.id) ? "" : ""}
                            className={`w-5 h-5 transform transition-transform duration-200 ${toggleCommentDisLikeLoading ? "scale-125" : ""
                                }`} />
                        <span className="font-bold text-sm">{comment?.dislikeCount}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PostCommentCard
