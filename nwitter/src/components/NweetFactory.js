import { dbService, storageService } from "fbase";
import { useEffect, useState } from "react";
import {v4 as uuidv4} from "uuid";

const NweetFactory = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if(attachment !== ""){
            const attachmentRef = storageService
                .ref()
                .child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }

        await dbService.collection("nweets").add({
            text:nweet,
            createAt:Date.now(),
            createId: userObj.uid,
            attachmentUrl
        });
        setNweet("");
        setAttachment("");
    };

    const onChange = (event) => {
        event.preventDefault();

        const {
            target : {value},
        } = event;
        setNweet(value);
    }

    const onFireChange = (event) => {
    //console.log("🚀 ~ file: Home.js ~ line 43 ~ onFireChange ~ event", event.target.files);
        const {
            target:{files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
        //console.log("🚀 ~ file: Home.js ~ line 50 ~ onFireChange ~ finishedEvent", finishedEvent)
            const {
                currentTarget:{result},
            } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onClearAttatchment = () => setAttachment("");

    return (
        <form onSubmit={onSubmit}>
                <input
                    value={nweet}
                    onChange = {onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120} 
                />
                <input type="file" accept="image/*" onChange={onFireChange}/>
                <input type="submit" value="Nweet" />
                {attachment && (
                    <div>
                        <img alt="" src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttatchment}>Clear</button>
                    </div>
                )}
            </form>
    )
}

export default NweetFactory;
