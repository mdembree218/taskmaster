import React, { useEffect, useState, useCallback } from 'react';
import {
    getTaskComments,
    addTaskComment,
    getUser,
    getUsers
} from '../api';
import '../style/Style.css'; // Assuming you have a CSS file for styling

const Comment = ({ taskId, username }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ content: '', author: null, timestamp: null });
    const [error, setError] = useState('');
    const [authorUsername, setAuthorUsername] = useState(null);

    const fetchComments = useCallback(async () => {
        try {
            const response = await getTaskComments(taskId);
            setComments(response.data || []);
        } catch (error) {
            console.error('There was an error fetching the comments!', error);
        }
    }, [taskId]);

    const fetchUserUsername = useCallback(async () => {
        try {
            const response = await getUser(username);
            setAuthorUsername(response.data.username); // Ensure authorUsername is the username
        } catch (error) {
            console.error('There was an error fetching the user username!', error);
        }
    }, [username]);

    useEffect(() => {
        fetchComments();
        fetchUserUsername();
    }, [fetchComments, fetchUserUsername]);

    const handleCreateComment = async () => {
        if (!newComment.content.trim()) {
            setError('Content is mandatory.');
            return;
        }

        if (!taskId) {
            setError('Task ID is mandatory.');
            return;
        }

        if (!authorUsername) {
            setError('Author is mandatory.');
            return;
        }

        const now = new Date();
        const commentToCreate = {
            taskId: taskId,
            content: newComment.content,
            author: authorUsername,
            timestamp: [
                now.getUTCFullYear(),
                now.getUTCMonth() + 1, // Months are zero-based in JavaScript
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds(),
                now.getUTCMilliseconds() * 1000 // Convert milliseconds to nanoseconds
            ]
        };

        try {
            const response = await addTaskComment(taskId, commentToCreate);
            setComments([...comments, response.data]);
            setNewComment({ content: '', author: null, timestamp: null });
            setError('');
        } catch (error) {
            console.error('There was an error creating the comment!', error);
            console.error(error.response.data);
        }
    };

    return (
        <div className="comment-container">
            <h2>Comments</h2>
            <div className="new-comment">
                <label htmlFor="new-comment-content">New Comment</label>
                <textarea
                    id="new-comment-content"
                    value={newComment.content}
                    onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                    placeholder="New Comment"
                />
                <button onClick={handleCreateComment}>Add Comment</button>
                {error && <p className="error">{error}</p>}
            </div>
            <ul className="comments-list">
                {comments.map(comment => (
                    <li key={comment.id} className="comment-item">
                        <CommentAuthor authorUsername={comment.author} />
                        <span className="comment-content">{comment.content}</span>
                        <span className="comment-timestamp">
                            {new Date(comment.timestamp).toLocaleString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false
                            })}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const CommentAuthor = ({ authorUsername }) => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await getUsers();
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].username === authorUsername) {
                        setUsername(response.data[i].username);
                        console.log('Username:', response.data[i].username);
                        break;
                    }
                }
            } catch (error) {
                console.error('There was an error fetching the username!', error);
            }
        };

        fetchUsername();
    }, [authorUsername]);
    console.log('Username:', username);
    return <span className="comment-author">{username}</span>;
};

export default Comment;