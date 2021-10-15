import { dbService, storageService } from "fbase";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
        await dbService.doc(`chweets/${chweetObj.id}`).update({text : newChweet});
        setEditing(false);
    };

    return (
        <div className="chweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit} className="container chweetEdit">
                        <input onChange={onChange} value={newChweet} required placeholder="Edit your chweet" autoFocus className="formInput"/>
                        <input type="submit" value="Update Chweet" className="formBtn"/>
                    </form>
                    <button onClick={toggleEditing} className="formBtn cancelBtn">Cancel</button>
                </>
            ) : (
                <>
                    <h4>{chweetObj.text}</h4>
                    {chweetObj.attachmentUrl && (
                        <img src={chweetObj.attachmentUrl} width="50px" height="50px"/>
                    )}
                    {isOwner && (
                        <div className="chweet__actions">
                            <span onClick={onDeleteClick}><FontAwesomeIcon icon={faTrash}/></span>
                            <span onClick={toggleEditing}><FontAwesomeIcon icon={faPencilAlt}/></span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Chweet;