import { createContext, useState } from "react";

const UserContext = createContext();

function Provider({childern}) {
    const [user, SetUser] = useState();

    const fetchUser = async () => {
        SetUser("hi")
    }

    const valueToShare = {
        user,
        fetchUser
    }

    return (
        <UserContext.Provider value={valueToShare}>
            {childern}
        </UserContext.Provider>
    )
}

export { Provider } ;
export default UserContext;