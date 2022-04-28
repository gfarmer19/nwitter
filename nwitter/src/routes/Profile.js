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
        <div className="container">
            <form onSubmit = {onSubmit} className="profileForm">
                <input 
                    onChange={onChange}
                    type="text" 
                    placeholder="Display name" 
                    value={newDisplayName}
                    autoFocus
                    className="formInput"
                />
                <input 
                    type="submit" 
                    placeholder="Update Profile" 
                    className="formBtn"
                    style={{
                        marginTop:10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    )
}

export default Profile;