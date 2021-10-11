import { authService, dbService, storageService } from "fbase";
import { useEffect, useState } from "react";
import Chweet from "components/Chweet";
//import { useHistory } from "react-router-dom";

const Profile = ({userObj}) => {
    //const history = useHistory();

    const [chweets, setChweets] = useState([]);
    
    const onLogoutClick = () => {
        authService.signOut();
        //history.push("/");
    };

    const getMyChweets = async () => {
        const dbChweets = await dbService
            .collection("chweets")
            .where("creatorId", "==", userObj.uid)  // 조건
            .orderBy("createdAt", "asc")            // 정렬 => 파이어스토어에서 index 작업돼야함
            .get();
        
        dbChweets.forEach((document) => {
            const chweetObject = {...document.data(), id:document.id};
            setChweets((prev) => [chweetObject, ...prev])
        });
    };

    useEffect(() => {
        getMyChweets();
    }, []);

    return (
        <>
            <button onClick={onLogoutClick}>Log Out</button>
            <div>
                {chweets.map((chweet) => (
                    <Chweet key={chweet.id} chweetObj={chweet} isOwner={chweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </>
    );
};

export default Profile;