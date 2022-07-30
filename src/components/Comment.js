import React, { useEffect, useState } from "react";
import axios from "axios";

function Comment({ commentId }) {
  const [getComment, setGetComment] = useState([]);
  const [isSumbit, setIsSubmit] = useState(0);
  const [userList, setUserList] = useState([]);
  const [comment, setComment] = useState("");
  const [commentReply, setCommentReply] = useState("");
  const [commentList, setcommentList] = useState([]);
  const [handleShowReply, sethandleShowReply] = useState(false);
  const [stateReply, setStateReply] = useState(0);
  const getCommentAxios = axios.create({
    withCredentials: true,
  });
  useEffect(() => {
    const axiosgetComment = async () => {
      await getCommentAxios
        .get(`http://localhost:3001/comment/getComment/${commentId.id}`)
        .then(async (res) => {
          setGetComment(res.data.getComment);
          setUserList(res.data.userId);
          setcommentList(res.data.getComment.comment);
        });
    };
    axiosgetComment();
  }, [isSumbit]);
  const handleComment = async () => {
    await getCommentAxios
      .post("http://localhost:3001/comment/createComment", {
        probId: commentId.id,
        comment,
      })
      .then(() => {
        setComment("");
        setIsSubmit(isSumbit + 1);
        sethandleShowReply(false);
        
      });
  };
  const handleCommentReply = async ({ commentReplyId }) => {
    await getCommentAxios
      .post("http://localhost:3001/comment/commentReply", {
        commentId: getComment._id,
        comment: commentReply,
        commentReplyId,
      })
      .then(() => {
        setIsSubmit(isSumbit + 1);
        setCommentReply("");
        
      });
  };
  return (
    <>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Comments</h3>
      <div className="mb-10 shadow-md max-w-screen  antialiased border rounded-lg">
        <label className="block mb-2">
          <span className="text-gray-600">Add a comment</span>
          <textarea
            className="block w-full mt-1 rounded"
            rows="3"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          ></textarea>
        </label>
        <button
          className="px-3 py-2 text-sm text-blue-100 bg-blue-600 rounded"
          onClick={handleComment}
        >
          Comment
        </button>
      </div>
      <div className="antialiased  max-w-screen">
        <div className="space-y-4">
          {getComment?.comment?.length > 0 ? (
            <>
              {" "}
              {getComment.comment.map((data, index) => (
                <>
                  <div className="flex" key={index}>
                    <div className="flex-shrink-0 mr-3"></div>
                    <div className="flex-1 border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                      <strong>{userList[index]}</strong>{" "}
                      <span className="text-xs text-gray-400">3:34 PM</span>
                      <p className="text-sm">{data.comment}</p>
                      <strong
                        onClick={(e) => {
                          e.preventDefault();
                          sethandleShowReply(true);
                          setStateReply(index);
                        }}
                        className="cursor-pointer"
                      >
                        Reply
                      </strong>
                      <div className="">
                        <div className="">
                          {handleShowReply === true && index === stateReply ? (
                            <>
                              <div className="mb-10 shadow-md w-auto mt-3  antialiased border rounded-lg">
                                <label className="block mb-2">
                                  <span className="text-gray-600">
                                    Add a reply
                                  </span>
                                  <textarea
                                    className="block w-full mt-1 rounded"
                                    rows="3"
                                    onChange={(e) =>
                                      setCommentReply(e.target.value)
                                    }
                                    value={commentReply}
                                  ></textarea>
                                </label>
                                <button
                                  className="px-3 py-2 text-sm text-blue-100 bg-blue-600 rounded"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleCommentReply({
                                      commentReplyId: data.id,
                                    });
                                  }}
                                >
                                  Reply
                                </button>
                              </div>
                            </>
                          ) : null}
                        </div>
                        <div className="text-sm text-gray-500 font-semibold">
                          {console.log(data)}
                          {data.reply.length > 0 ? (
                            <>Reply: {data.reply.length}</>
                          ) : null}
                          {data.reply.length > 0 ? (
                            <>
                              {" "}
                              {data.reply.map((datareply, index) => (
                                <>
                                  {" "}
                                  <div className="space-y-4 mb-5">
                                    <div className="flex">
                                      <div className="flex-shrink-0 mr-3 "></div>
                                      <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                                        <strong>{datareply.userName}</strong>{" "}
                                        <span className="text-xs text-gray-400">
                                        
                                        </span>
                                        <p className="text-xs sm:text-sm">
                                          {datareply.comment}
                                        </p>
                                      </div>
                                    </div>
                                  </div>{" "}
                                </>
                              ))}
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </>
          ) : null}

          <div className="flex">
            <div className="flex-shrink-0 mr-3"></div>
            <div className="flex-1 border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
              <strong>Sarah</strong>{" "}
              <span className="text-xs text-gray-400">3:34 PM</span>
              <p className="text-sm">
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut labore et dolore magna
                aliquyam erat, sed diam voluptua.
              </p>
              <h4 className="my-5 uppercase tracking-wide text-gray-400 font-bold text-xs">
                Replies
              </h4>
              {/*This is Reply */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Comment;
