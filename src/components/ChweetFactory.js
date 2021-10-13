import { dbService, storageService } from "fbase";
import { useEffect, useState } from "react";
import {v4 as uuidv4} from "uuid";

const ChweetFactory = ({userObj}) => {
    const [chweet, setChweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        
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
        <form onSubmit={onSubmit}>
            <input value={chweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
            <input type="file" accept="image/*" onChange={onFileChange}/>
            <input type="submit" value="Chweet"/>
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px"/>
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
        </>
    );
};

export default ChweetFactory;