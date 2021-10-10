import { dbService, storageService } from "fbase";
import { useState } from "react";

const Chweet = ({ chweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newChweet, setNewChweet] = useState(chweetObj.text);

    // 삭제
    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");

        if(ok){
            await dbService.doc(`chweets/${chweetObj.id}`).delete();

            if(chweetObj.attachmentUrl !== ""){
                await storageService.refFromURL(chweetObj.attachmentUrl).delete();
            }
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    const onChange = (event) => {
        const {
            target : {value},
        } = event;
        setNewChweet(value);
    };

    // 수정
    const onSubmit = async (event) => {
        event.preventDefault();
        //console.log(chweetObj.id, newChweet);
        await dbService.doc(`chweets/${chweetObj.id}`).update({text : newChweet});
        setEditing(false);
    };

    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input onChange={onChange} value={newChweet} required/>
                        <input type="submit" value="Update Chweet"/>
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <>
                    <h4>{chweetObj.text}</h4>
                    {chweetObj.attachmentUrl && (
                        <img src={chweetObj.attachmentUrl} width="50px" height="50px"/>
                    )}
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete Chweet</button>
                            <button onClick={toggleEditing}>Edit Chweet</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Chweet;