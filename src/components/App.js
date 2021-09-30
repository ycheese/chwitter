import {useEffect, useState} from "react";
import AppRouter from "components/Router";
import {authService} from "fbase";

function App(){
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // useEffect : 특정한 시점에 실행되는 함수
  // firebase로부터 인증 완료 후 실행됨
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user){
        setIsLoggedIn(user);
      }else{
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn}/> : "initializing..."}
      <footer>&copy; {new Date().getFullYear()} Chwitter</footer>
    </>
  );
}

export default App;