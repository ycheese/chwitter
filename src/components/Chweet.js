import { dbService  } from "fbase";

const Chweet = ({ chweetObj, isOwner }) => {
    const onDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        console.log(ok);
        if(ok){
            console.log(chweetObj.id);
            const data = await dbService.doc(`chweets/${chweetObj.id}`).delete();
            console.log(data);
        }
    };

    return (
        <div>
            <h4>{chweetObj.text}</h4>
            {isOwner && (
                <>
                    <button onClick={onDeleteClick}>Delete Chweet</button>
                    <button>Edit Chweet</button>
                </>
            )}
        </div>
    );
};

export default Chweet;