import { useState } from "react";
import { dbService, storageService } from "fbase";
import {v4 as uuidv4} from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        if(nweet === "") {
            return;
        }

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
        if(Boolean(theFile)){ 
            reader.readAsDataURL(theFile);
        }
    }

    const onClearAttatchment = () => setAttachment("");

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={nweet}
                    onChange = {onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120} 
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input 
                id="attach-file"
                type="file" 
                accept="image/*" 
                onChange={onFireChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img 
                        alt="" 
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttatchment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    )
}

export default NweetFactory;
