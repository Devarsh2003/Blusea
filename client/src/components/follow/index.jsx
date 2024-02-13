import { Box, Button, useTheme } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../../redux/reducers";
import { useEffect, useState } from "react";

export const Follow = ({ user2userName }) => {
    const user1 = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const theme = useTheme();
    const dispatch = useDispatch();
    const [user2, setuser2] = useState([]);
    const [Type, setType] = useState("Follow");
    const getUser2 = async (user1) => {
        await fetch(`http://localhost:3001/users/${user2userName}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }).then(async (res) => {
            const data = await res.json();
            setuser2(data);
            const user2 = data;
            // console.log(user2, user1)
            return { user2, user1 }
        }).then(async ({ user2, user1 }) => {

            console.log("user2", user2);
            console.log("user1", user1);
            const isUser1Following = await user2.followers.includes(user1._id)
            const isUser2Following = await user1.followers.includes(user2._id)
            const isReqsent = await user1.sentRequest.includes(user2._id)
            // const isRequest = await user2.followRequest.includes(user1._id)

            console.log("isUser1Following", isUser1Following);
            console.log("isUser2Following", isUser2Following);
            console.log("isReqsent", isReqsent);
            // console.log("isRequest", isRequest);

            if (!isUser1Following && !isUser2Following) {
                setType("Follow");
            } else if (!isUser1Following && isReqsent) {
                setType("Requested");
            } else if (isUser1Following && isUser2Following) {
                setType("Unfollow");
            } else if (!isUser1Following && isUser2Following && !isReqsent) {
                setType("Follow back");
            } else if (isUser1Following && !isUser2Following) {
                setType("Unfollow");
            } else {
                setType("Unknown");
            }
        })
    }
    useEffect(() => {
        getUser2(user1)
    }, [user1, Type]) //eslint-disable-line react-hooks/exhaustive-deps

    const handleClick = async (Type, user1, user2) => {
        try {
            let url = '';
            let method = '';
            if (await Type === "Unfollow") {
                url = `http://localhost:3001/users/${user1._id}/unfollow/${user2._id}`;
                method = 'PUT';
            }
            else if (await Type === "Requested") {
                url = `http://localhost:3001/users/${user1._id}/follow-request/${user2._id}/cancel`;
                method = 'PUT';
            }
            else if (await Type === "Follow" || await Type === "Follow back") {
                url = `http://localhost:3001/users/${user1._id}/follow-request/${user2._id}`;
                method = 'PUT';
            }
            else {
                console.error("Invalid action type");
                return;
            }
            await fetch(url, {
                method: method,
                headers: {}
            }).then(async (res) => {
                const updatedUser = await res.json();
                dispatch(setLogin({
                    user: updatedUser,
                    token: token
                }));
                // console.log("updatedUser", updatedUser);
                // console.log("User2Id", user2Id);
                return { user1: updatedUser, user2 }
            }).then(async ({ user1, user2 }) => {
                const isUser1Following = await user2.followers.includes(user1._id)
                const isUser2Following = await user1.followers.includes(user2._id)
                const isReqsent = await user1.sentRequest.includes(user2._id)
                // const isRequest = await user2.followRequest.includes(user1._id)

                // console.log("isUser1Following", isUser1Following);
                // console.log("isUser2Following", isUser2Following);
                // console.log("isReqsent", isReqsent);
                // console.log("isRequest",isRequest)

                if (!isUser1Following && !isUser2Following) {
                    setType("Follow");
                } else if (isUser1Following && isUser2Following) {
                    setType("Unfollow");
                } else if (!isUser1Following && isReqsent) {
                    setType("Requested");
                } else if (!isUser1Following && isUser2Following && !isReqsent) {
                    setType("Follow back");
                } else if (isUser1Following && !isUser2Following) {
                    setType("Unfollow");
                } else {
                    setType("Unknown");
                }
            })
        } catch (error) {
            console.error("Error in following the user:", error);
        }
    }
    return <Box>
        <Button type="submit" variant="outlined" sx={{ color: theme.palette.neutral.dark }}
            onClick={() => { handleClick(Type, user1, user2) }} >
            {Type}
        </Button>
    </Box>
}

export const Accept = ({ reqId }) => {
    const dispatch = useDispatch();
    const { _id } = useSelector(state => state.user)
    const token = useSelector(state => state.token)
    // const { palette } = useTheme();
    const handleClick = async () => {
        let res = await fetch(`http://localhost:3001/users/${_id}/follow-request/${reqId}/accept`, {
            method: "PUT",
            headers: {},
        })
        const updatedUser = await res.json();
        dispatch(setLogin({ user: updatedUser, token: token }));
    }
    return <>
        <Button onClick={handleClick} variant="text" color="success" sx={{ flex: 1 }}>
            Accept
        </Button>
    </>
}

export const Decline = ({ reqId }) => {
    const dispatch = useDispatch();
    const { _id } = useSelector(state => state.user)
    const token = useSelector(state => state.token)
    // const { palette } = useTheme();
    const handleClick = async () => {
        let res = await fetch(`http://localhost:3001/users/${_id}/follow-request/${reqId}/reject`, {
            method: "PUT",
            headers: {},
        })
        const updatedUser = await res.json();
        dispatch(setLogin({ user: updatedUser, token: token }));
    }
    return <>
        <Button onClick={handleClick} variant="text" color="error" sx={{ flex: 1, }}>
            Decline
        </Button>
    </>
}