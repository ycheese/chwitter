import { dbService } from "fbase";
import { useEffect, useState } from "react";

const Home = () => {
    const [chweet, setChweet] = useState("");
    const [chweets, setChweets] = useState([]); // 파이어스토어에서 받은 데이터는 상태로 관리해야 화면에 보여줄 수 있음

    const getChweets = async () => {
        const dbChweets = await dbService.collection("chweets").get();
        //console.log(dbChweets);
        //dbChweets.forEach((document) => console.log(document.data()));
        dbChweets.forEach((document) => {
            const chweetObject = {...document.data(), id:document.id};
            //setChweets((prev) => [document.data(), ...prev])
            setChweets((prev) => [chweetObject, ...prev])
        });
    };

    useEffect(() => {
        getChweets();
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("chweets").add({
            text : chweet,
            createdAt : Date.now(),
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

    return (
        <>
        <form onSubmit={onSubmit}>
            <input value={chweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
            <input type="submit" value="Chweet"/>
        </form>
        <div>
            {chweets.map((chweet) => (
                <div key={chweets.id}>
                    <h4>{chweet.text}</h4>
                </div>
            ))}
        </div>
        </>
    );
};

export default Home;