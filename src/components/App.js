import {useEffect, useState} from "react";
import AppRouter from "components/Router";
import {authService} from "fbase";

function App(){
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  // useEffect : 특정한 시점에 실행되는 함수
  // firebase로부터 인증 완료 후 실행됨
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user){
        //setIsLoggedIn(user);
        // state나 props의 내용물이 너무 많으면 변화를 인식하지 못함 => 리액트의 한계
        // setUserObj({user}); 로 할 경우 userObj 내용이 너무 많다.
        setUserObj({
          uid : user.uid,
          displayName : user.displayName,
          updateProfile : (args) => user.updateProfile(args),
        });
      }else{
        setUserObj(false);  // 유저 없는 경우 false로 초기화
      }
      setInit(true);
    });
  }, []);

  // Profile 컴포넌트에서 사용자 이름을 변경하는 경우 리렌더링을 위한 props update
  const refreshUser = () => {
    //setUserObj(authService.currentUser);
    const user = authService.currentUser;
    setUserObj({
      uid : user.uid,
      displayName : user.displayName,
      updateProfile : (args) => user.updateProfile(args),
    });
  };

  return (
    <>
      {init ? (
      <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj}/>
       ) : (
         "initializing..."
       )}
    </>
  );
}

export default App;