import { authService, firebaseInstance } from "fbase";
import AuthForm from "components/AuthForm";

const Auth = () => {

        const onSocialClick = async (event) => {
        const {
            target: {name},
        } = event;
        
        let provider;
        if(name === "google"){
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        }else if(name === "github"){
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }

        await authService.signInWithPopup(provider);
    }

    return (
        <div>
            <AuthForm  />
            <div>
                <button onClick={onSocialClick} name="google">Continue With Google</button>
                <button onClick={onSocialClick} name="github">Continue With Github</button>
            </div>
        </div>
    )
};

export default Auth;