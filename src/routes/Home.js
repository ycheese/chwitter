import { dbService } from "fbase";
import { useEffect, useState } from "react";
import Chweet from "components/Chweet";

const Home = ({userObj}) => {
    //console.log(userObj);
    const [chweet, setChweet] = useState("");
    const [chweets, setChweets] = useState([]); // 파이어스토어에서 받은 데이터는 상태로 관리해야 화면에 보여줄 수 있음
    const [attachment, setAttachment] = useState("");

    // 실시간 데이터베이스 도입 위해 주석 처리
    // get() 함수는 처음에 화면을 렌더링 할 때만 실행되므로 트윗을 작성할 때 마다 새로고침을 해줘야 함.
    // const getChweets = async () => {
    //     const dbChweets = await dbService.collection("chweets").get();
    //     //console.log(dbChweets);
    //     //dbChweets.forEach((document) => console.log(document.data()));
    //     dbChweets.forEach((document) => {
    //         const chweetObject = {...document.data(), id:document.id};
    //         //setChweets((prev) => [document.data(), ...prev])
    //         setChweets((prev) => [chweetObject, ...prev])
    //     });
    // };

    useEffect(() => {
        //getChweets();
        // get() 대신 onSnapshot() 함수를 써서 실시간 데이터베이스 도입 완료
        dbService.collection("chweets").onSnapshot((snapShot) => {
            const newArray = snapShot.docs.map((document) => ({
                id : document.id,
                ...document.data(),
            }));
            setChweets(newArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("chweets").add({
            text : chweet,
            createdAt : Date.now(),
            creatorId : userObj.uid,
        });
        setChweet("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target : {value},
        } =  event;
        setChweet(value);
    };

    const onFileChange = (event) => {
        //console.log(event.target.files);
        const {
            target : {files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            //console.log(finishedEvent);
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
        <div>
            {chweets.map((chweet) => (
                <Chweet key={chweet.id} chweetObj={chweet} isOwner={chweet.creatorId === userObj.uid}/>
            ))}
        </div>
        </>
    );
};

export default Home;