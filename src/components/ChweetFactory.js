import { dbService, storageService } from "fbase";
import { useEffect, useState } from "react";
import {v4 as uuidv4} from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const ChweetFactory = ({userObj}) => {
    const [chweet, setChweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();

        // 빈 입력일 경우 저장하지 않음
        if(chweet === ""){
            return;
        }
        
        let attachmentUrl = "";
        if(attachment !== ""){  // 사진 파일 유무와 상관없이 레퍼런스를 생성하는 문제 방지
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        
        await dbService.collection("chweets").add({
            text : chweet,
            createdAt : Date.now(),
            creatorId : userObj.uid,
            attachmentUrl,
        });
        setChweet("");
        setAttachment("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target : {value},
        } =  event;
        setChweet(value);
    };

    const onFileChange = (event) => {
        const {
            target : {files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const{
                currentTarget : {result},
            } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onClearAttachment = () => setAttachment("");

    return (
        <>
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input className="factoryInput__input" value={chweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
                <input type="submit" value="&rarr;" className="factoryInput__arrow"/>
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus}/>
            </label>
            <input id="attach-file" type="file" accept="image/*" onChange={onFileChange} style={{opacity:0,}}/>
            {attachment && (
                <div className="factoryForm__attachment">
                    <img src={attachment} style={{backgroundImage:attachment,}}/>
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes}/>
                    </div>
                </div>
            )}
        </form>
        </>
    );
};

export default ChweetFactory;