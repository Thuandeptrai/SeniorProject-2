import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, fromUnixTime, intervalToDuration } from "date-fns";

function Comment({ commentId }) {
  const [getComment, setGetComment] = useState([]);
  const [isSumbit, setIsSubmit] = useState(0);
  const [userList, setUserList] = useState([]);
  const [comment, setComment] = useState("");
  const [commentReply, setCommentReply] = useState("");
  const [commentList, setcommentList] = useState([]);
  const [handleShowReply, sethandleShowReply] = useState(false);
  const [stateReply, setStateReply] = useState(0);
  const [finalAns, setFinalAns] = useState("");

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
  const timeGap = (Time) => {
    const TimeFromNow = Date.now();
    const Test = intervalToDuration({
      start: fromUnixTime(parseInt(Time) / 1000),
      end: TimeFromNow,
    });
    let ans;
    if (Test.days === 0) {
      if (Test.hours === 0) {
        if (Test.minutes === 0) {
          ans = `${Test.seconds} seconds ago`;
        } else {
          ans = `${Test.minutes} minutes ago`;
        }
      } else {
        ans = `${Test.hours} hours ago`;
      }
    } else {
      ans = `${Test.days} days ago`;
    }
    return <>{ans}</>;
  };
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
      <h3 className="text-lg mt-5 mb-5 font-semibold text-gray-900">
        Comment{" "}
        {getComment?.comment?.length > 0
          ? "(" + getComment?.comment?.length + ")"
          : "(0)"}{" "}
      </h3>
      <div className="mb-10 shadow-md max-w-screen  antialiased border rounded-lg px-5 py-5">
        <label className="block mb-2">
          <textarea
            className="block w-full mt-1 rounded"
            rows="3"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder="Add a comment"
          ></textarea>
        </label>
        <button
          className={`${comment.length === 0 ? "opacity-50  cursor-not-allowed" : null} px-3 py-2 text-sm text-zinc-50 lg:font-bold lg:text-xl bg-blue-600 rounded`}
          onClick={handleComment}
          disabled={comment.length === 0 ? true : false}
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
                  <div className="flex" key={data.id}>
                    <div className="flex-shrink-0 mr-3"> </div>
                    <div className="  flex-1 border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                      <div>
                        <div className="flex   ">
                          <div className="flex-none ...">
                            {" "}
                            <strong className="text-sm lg:text-xl">
                              {userList[index]}
                            </strong>{" "}
                            <span className="text-xs text-gray-400">
                              {" "}
                              {timeGap(data.Time)}
                            </span>
                            <p className="text-sm  lg:text-xl">
                              {data.comment}
                            </p>
                          </div>
                         
                        </div>
                      </div>

                      <div className="mb-5 mt-5">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (handleShowReply === true) {
                              if (stateReply === index) {
                                sethandleShowReply(false);
                              }
                            } else {
                              sethandleShowReply(true);
                            }

                            setStateReply(index);
                          }}
                          className="cursor-pointer lg:font-bold lg:text-l px-3 py-2 text-sm text-zinc-50 bg-blue-600 rounded "
                        >
                          Reply
                        </button>
                      </div>
                      <div className="">
                        <div className="">
                          {handleShowReply === true && index === stateReply ? (
                            <>
                              <div className="px-5 py-5 mb-10 shadow-md w-auto mt-3  antialiased border rounded-lg">
                                <label className="block mb-2">
                                  <textarea
                                    className=" block w-full mt-1 rounded"
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
                                          {" "}
                                          {timeGap(datareply.Time)}
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
        </div>
      </div>
    </>
  );
}

export default Comment;
