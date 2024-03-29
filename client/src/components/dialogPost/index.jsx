import { Avatar, Box, Button, Dialog, Divider, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { formatDistanceToNow } from 'date-fns';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
// import TurnedInIcon from '@mui/icons-material/TurnedIn';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import { useEffect, useState } from "react";
import ImageWidget from "../imgwidget";
import Like from "../like";
// import { useSelector } from "react-redux";
// import Follow from "../follow";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DialogPost = ({ item, open, handleClose,onClose}) => {
    const [post,setPost] = useState(item);
    // console.log("Post:",post)
    const user = useSelector((state) => state.user);
    const POSTS = useSelector((state) => state.posts);
    // const LIKES = likes.length
    // const COMMENTS = comments.length
    const navigate = useNavigate();
    const theme = useTheme();
    const { typography } = useTheme();
    const [comment, setComment] = useState("");
    const isNonMobile = useMediaQuery("(min-width:768px)")
    const [timeAgo, setTimeAgo] = useState('');

    // console.log(postId, profilePic, picturePath, pictureAlt, userName, likes, createdAt, open, handleClose)
    const getPost = async (post) => {
        // console.log(post)
        await fetch(`http://localhost:3001/posts/${post._doc._id}`, {
            method: 'GET',
            headers: { },
        }).then(async (res) => await res.json()).then(async (data) => {
            // console.log(data);
            setPost(data)
        }).catch(err => { console.log(err) });
    }

    useEffect(()=>{
        getPost(post)
    },[POSTS,post])

    const handleComment = async () => {

        await fetch(`http://localhost:3001/posts/${post._doc.id}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user._id,
                comment: comment
            })
        }).then(async (res) => await res.json()).then(async (data) => {
            // console.log(data);
            setComment("");
        }).catch(err => { console.log(err) });
    }

    useEffect(() => {
        const calculateTimeAgo = () => {
            if (post._doc.createdAt) {
                const timeAgoString = formatDistanceToNow(new Date(post._doc.createdAt), { addSuffix: true });
                setTimeAgo(timeAgoString);
            }
        };
        calculateTimeAgo();
        const intervalId = setInterval(() => {
            calculateTimeAgo();
        }, 60000);
        return () => clearInterval(intervalId);
    }, [post._doc.createdAt]);

    const NavigateToProfile = () => {
        navigate(`/profile/${post.userName}`);
    }   
    // return (<></>)
    return <Dialog maxWidth={isNonMobile ? 'md' : "sm"} fullWidth open={open} onClose={handleClose} >
        <CloseOutlinedIcon onClick={handleClose} sx={{ fontSize: "2rem", position: "fixed", top: ".3rem", right: ".3rem" }} />
        <Box sx={{ flex: 1, display: "flex", flexDirection: isNonMobile ? "row" : "column", overflowY: "auto", scrollbarWidth: "none" }}>
            <Box sx={{ width: isNonMobile ? "600px" : "100%", p: "0 0.5rem" }}>
                <ImageWidget src={post.url} alt={post.pictureAlt} />
            </Box>
            <Divider orientation={isNonMobile ? "vertical" : "horizontal"} variant="middle" flexItem ></Divider>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {/* first Box */}
                <Box>
                    <Box sx={{ display: "flex", gap: "0.5rem", p: "0.5rem 0.5rem" }}>
                        <Box>
                            {
                                post.picturePath === "" ?
                                    <Avatar sx={{ borderRadius: 2, height: "2.5rem", width: "2.5rem" }}></Avatar>
                                    :
                                    <Avatar src={post.picturePath} sx={{ borderRadius: 2, height: "2.5rem", width: "2.5rem" }}></Avatar>
                            }
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography sx={{ fontSize: typography.h5, fontFamily: typography.h5, cursor: "pointer" }} onClick={NavigateToProfile} >{post.userName}</Typography>
                            <Typography sx={{ fontSize: typography.h6, fontFamily: typography.h6 }}>{timeAgo} </Typography>
                        </Box>
                    </Box>
                    <Divider orientation="horizontal" variant="fullwidth" flexItem ></Divider>
                </Box>
                {/* second Box */}
                <Box sx={{ p: 1 }}>
                    <Divider orientation="horizontal" variant="fullwidth" flexItem ></Divider>
                    <Box sx={{ display: "flex", justifyContent: "space-between", p: "0.4rem 0" }}>
                        <Box sx={{
                            display: "flex",
                            gap: "1rem",
                            '& > *:hover': {
                                color: theme.palette.neutral.main,
                            },
                        }}>
                            <Box>
                                <Like postId={post._doc._id} likes={post._doc.likes} />
                            </Box>
                            <Box>
                                <ModeCommentOutlinedIcon sx={{ fontSize: "1.7rem" }} />
                            </Box>
                            <Box>
                                <SendOutlinedIcon sx={{ fontSize: "1.7rem" }} />
                            </Box>
                        </Box>
                        <Box sx={{
                            '& > *:hover': {
                                color: theme.palette.neutral.main,
                            },
                        }}>
                            <Box>
                                <TurnedInNotIcon sx={{ fontSize: "1.7rem" }} />
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        <Typography>{post._doc.likes.length} likes </Typography>
                    </Box>

                    {/* add a comment textfield */}
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <TextField fullWidth size="small" variant="standard" label="Add a comment..." value={comment} onChange={(e) => { setComment(e.target.value) }} />
                        <Button disabled={!comment || comment === "" ? true : false} sx={{ display: comment === "" ? "none" : "block", color: theme.palette.neutral.dark, }} onClick={handleComment}>Post</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    </Dialog>
}
export default DialogPost