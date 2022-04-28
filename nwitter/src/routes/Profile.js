import { authService, dbService } from "fbase";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nweet from "components/Nweet"

const Profile = ({userObj, refreshUser}) => {
    const [nweets, setNweets] = useState([]);
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState([]);

    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };

    const onChange = (event) => {
        const {
            target : {value},
        } = event;

        setNewDisplayName(value);
    }

    const getMyNweets = async () => {
        const nweets = await dbService
            .collection("nweets")
            .where("createId","==",userObj.uid)
            .orderBy("createAt","asc")
            .get();

            const newArray = nweets.docs.map((document) => ({
                id:document.id,
                ...document.data()
            }));

            setNweets(newArray);
    }

    useEffect(() => {
        getMyNweets();
    },[]);

    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await userObj.updateProfile({displayName:newDisplayName});
            refreshUser();
        }
    }

    return (
        <>
            <form onSubmit = {onSubmit}>
                <input 
                    onChange={onChange}
                    type="text" 
                    placeholder="Display name" 
                    value={newDisplayName}
                />
                <input type="submit" placeholder="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
            <div>
                {nweets.map((nweet) => (
                   <Nweet 
                    key={nweet.id} 
                    nweetObj={nweet}
                    isOwner = {nweet.createId === userObj.uid}
                   />
                ))}
            </div>
        </>
    )
}

export default Profile;